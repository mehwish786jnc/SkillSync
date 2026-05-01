import { Response, NextFunction } from 'express';
import prisma from '../config/prisma';
import { AppError } from '../utils/AppError';
import { AuthRequest } from '../middleware/auth';
import {
  createApplicationSchema,
  updateApplicationStatusSchema,
} from '../validators/schemas';

/** POST /api/applications (CANDIDATE only) */
export async function applyToJob(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const data = createApplicationSchema.parse(req.body);

    const job = await prisma.job.findUnique({ where: { id: data.jobId } });
    if (!job || job.status !== 'PUBLISHED') {
      throw new AppError('Job not found or not open', 404);
    }

    const existing = await prisma.application.findUnique({
      where: { candidateId_jobId: { candidateId: req.user!.userId, jobId: data.jobId } },
    });
    if (existing) {
      throw new AppError('You have already applied to this job', 409);
    }

    const application = await prisma.application.create({
      data: {
        candidateId: req.user!.userId,
        jobId: data.jobId,
        coverNote: data.coverNote,
      },
      include: {
        job: { select: { id: true, title: true, company: true } },
      },
    });

    res.status(201).json({ status: 'success', data: { application } });
  } catch (err) {
    next(err);
  }
}

/** GET /api/applications/my (CANDIDATE - own applications) */
export async function getMyApplications(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const applications = await prisma.application.findMany({
      where: { candidateId: req.user!.userId },
      include: {
        job: {
          select: { id: true, title: true, company: true, location: true, type: true, status: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ status: 'success', data: { applications } });
  } catch (err) {
    next(err);
  }
}

/** GET /api/applications/job/:jobId (RECRUITER - applications for a job) */
export async function getJobApplications(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const job = await prisma.job.findUnique({ where: { id: req.params.jobId } });
    if (!job) {
      throw new AppError('Job not found', 404);
    }
    if (job.recruiterId !== req.user!.userId) {
      throw new AppError('You can only view applications for your own jobs', 403);
    }

    const applications = await prisma.application.findMany({
      where: { jobId: req.params.jobId },
      include: {
        candidate: {
          select: { id: true, name: true, email: true, avatar: true, skills: true, bio: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ status: 'success', data: { applications } });
  } catch (err) {
    next(err);
  }
}

/** PATCH /api/applications/:id/status (RECRUITER - update application status) */
export async function updateApplicationStatus(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const { status } = updateApplicationStatusSchema.parse(req.body);

    const application = await prisma.application.findUnique({
      where: { id: req.params.id },
      include: { job: true },
    });

    if (!application) {
      throw new AppError('Application not found', 404);
    }
    if (application.job.recruiterId !== req.user!.userId) {
      throw new AppError('You can only update applications for your own jobs', 403);
    }

    const updated = await prisma.application.update({
      where: { id: req.params.id },
      data: { status },
      include: {
        candidate: { select: { id: true, name: true, email: true } },
        job: { select: { id: true, title: true } },
      },
    });

    res.json({ status: 'success', data: { application: updated } });
  } catch (err) {
    next(err);
  }
}

/** DELETE /api/applications/:id (CANDIDATE - withdraw application) */
export async function withdrawApplication(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const application = await prisma.application.findUnique({
      where: { id: req.params.id },
    });

    if (!application) {
      throw new AppError('Application not found', 404);
    }
    if (application.candidateId !== req.user!.userId) {
      throw new AppError('You can only withdraw your own applications', 403);
    }

    await prisma.application.delete({ where: { id: req.params.id } });

    res.json({ status: 'success', message: 'Application withdrawn' });
  } catch (err) {
    next(err);
  }
}
