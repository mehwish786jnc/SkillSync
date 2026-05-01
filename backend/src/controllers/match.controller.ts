import { Response, NextFunction } from 'express';
import prisma from '../config/prisma';
import { AppError } from '../utils/AppError';
import { AuthRequest } from '../middleware/auth';
import { rankCandidates, rankJobs, scoreMatch } from '../utils/matching';

// Shared select clause — only fetch fields the matching engine needs
const CANDIDATE_SELECT = {
  id: true, name: true, skills: true, bio: true,
} as const;

const JOB_SELECT = {
  id: true, title: true, description: true, skills: true,
} as const;

/**
 * GET /api/matching/jobs
 * Candidate → find best-matching published jobs.
 * Query: ?limit=20&minScore=0
 */
export async function matchJobsForCandidate(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 20));
    const minScore = Math.max(0, parseInt(req.query.minScore as string) || 0);

    // Fetch candidate profile
    const candidate = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: CANDIDATE_SELECT,
    });
    if (!candidate) throw new AppError('User not found', 404);

    // Fetch all published jobs in one query (indexed on status)
    const jobs = await prisma.job.findMany({
      where: { status: 'PUBLISHED' },
      select: JOB_SELECT,
    });

    // Score & rank in-memory — fast for thousands of jobs
    const results = rankJobs(candidate, jobs)
      .filter((r) => r.score >= minScore)
      .slice(0, limit);

    res.json({ status: 'success', data: { matches: results, total: results.length } });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/matching/candidates?jobId=<uuid>
 * Recruiter → find best-matching candidates for a specific job they own.
 * Query: ?jobId=<uuid>&limit=20&minScore=0
 */
export async function matchCandidatesForJob(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const jobId = req.query.jobId as string;
    if (!jobId) throw new AppError('jobId query parameter is required', 400);

    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 20));
    const minScore = Math.max(0, parseInt(req.query.minScore as string) || 0);

    // Verify the job exists and belongs to this recruiter
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      select: { ...JOB_SELECT, recruiterId: true },
    });
    if (!job) throw new AppError('Job not found', 404);
    if (job.recruiterId !== req.user!.userId) {
      throw new AppError('You can only match candidates for your own jobs', 403);
    }

    // Fetch all candidates in one query
    const candidates = await prisma.user.findMany({
      where: { role: 'CANDIDATE' },
      select: CANDIDATE_SELECT,
    });

    // Score & rank in-memory
    const results = rankCandidates(candidates, job)
      .filter((r) => r.score >= minScore)
      .slice(0, limit);

    res.json({ status: 'success', data: { matches: results, total: results.length } });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/matching/score?jobId=<uuid>
 * Candidate → get their match score for a specific job.
 */
export async function getMatchScore(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const jobId = req.query.jobId as string;
    if (!jobId) throw new AppError('jobId query parameter is required', 400);

    const [candidate, job] = await Promise.all([
      prisma.user.findUnique({ where: { id: req.user!.userId }, select: CANDIDATE_SELECT }),
      prisma.job.findUnique({ where: { id: jobId }, select: JOB_SELECT }),
    ]);

    if (!candidate) throw new AppError('User not found', 404);
    if (!job) throw new AppError('Job not found', 404);

    const result = scoreMatch(candidate, job);

    res.json({ status: 'success', data: { match: result } });
  } catch (err) {
    next(err);
  }
}
