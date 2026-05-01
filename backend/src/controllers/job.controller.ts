import { Response, NextFunction } from 'express';
import prisma from '../config/prisma';
import { AppError } from '../utils/AppError';
import { AuthRequest } from '../middleware/auth';
import { createJobSchema, updateJobSchema } from '../validators/schemas';

/** GET /api/jobs */
export async function listJobs(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 20));
    const skip = (page - 1) * limit;
    const search = (req.query.search as string) || '';

    const where = {
      status: 'PUBLISHED' as const,
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' as const } },
          { company: { contains: search, mode: 'insensitive' as const } },
          { location: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        include: {
          recruiter: { select: { id: true, name: true, avatar: true } },
          _count: { select: { applications: true } },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.job.count({ where }),
    ]);

    res.json({
      status: 'success',
      data: { jobs, pagination: { page, limit, total, pages: Math.ceil(total / limit) } },
    });
  } catch (err) {
    next(err);
  }
}

/** GET /api/jobs/:id */
export async function getJobById(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const job = await prisma.job.findUnique({
      where: { id: req.params.id },
      include: {
        recruiter: { select: { id: true, name: true, avatar: true } },
        _count: { select: { applications: true } },
      },
    });

    if (!job) {
      throw new AppError('Job not found', 404);
    }

    res.json({ status: 'success', data: { job } });
  } catch (err) {
    next(err);
  }
}

/** POST /api/jobs (RECRUITER only) */
export async function createJob(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const data = createJobSchema.parse(req.body);

    const job = await prisma.job.create({
      data: { ...data, recruiterId: req.user!.userId, status: 'PUBLISHED' },
    });

    res.status(201).json({ status: 'success', data: { job } });
  } catch (err) {
    next(err);
  }
}

/** PATCH /api/jobs/:id (RECRUITER owner only) */
export async function updateJob(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const data = updateJobSchema.parse(req.body);

    const existing = await prisma.job.findUnique({ where: { id: req.params.id } });
    if (!existing) {
      throw new AppError('Job not found', 404);
    }
    if (existing.recruiterId !== req.user!.userId) {
      throw new AppError('You can only edit your own jobs', 403);
    }

    const job = await prisma.job.update({
      where: { id: req.params.id },
      data,
    });

    res.json({ status: 'success', data: { job } });
  } catch (err) {
    next(err);
  }
}

/** DELETE /api/jobs/:id (RECRUITER owner only) */
export async function deleteJob(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const existing = await prisma.job.findUnique({ where: { id: req.params.id } });
    if (!existing) {
      throw new AppError('Job not found', 404);
    }
    if (existing.recruiterId !== req.user!.userId) {
      throw new AppError('You can only delete your own jobs', 403);
    }

    await prisma.job.delete({ where: { id: req.params.id } });

    res.json({ status: 'success', message: 'Job deleted' });
  } catch (err) {
    next(err);
  }
}

/** GET /api/jobs/my (RECRUITER - own listings) */
export async function getMyJobs(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const jobs = await prisma.job.findMany({
      where: { recruiterId: req.user!.userId },
      include: { _count: { select: { applications: true } } },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ status: 'success', data: { jobs } });
  } catch (err) {
    next(err);
  }
}
