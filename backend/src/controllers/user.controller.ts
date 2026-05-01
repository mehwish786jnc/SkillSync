import { Response, NextFunction } from 'express';
import prisma from '../config/prisma';
import { AppError } from '../utils/AppError';
import { AuthRequest } from '../middleware/auth';
import { updateProfileSchema } from '../validators/schemas';

/** GET /api/users/:id */
export async function getUserById(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        bio: true,
        skills: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.json({ status: 'success', data: { user } });
  } catch (err) {
    next(err);
  }
}

/** PATCH /api/users/profile */
export async function updateProfile(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const data = updateProfileSchema.parse(req.body);

    const user = await prisma.user.update({
      where: { id: req.user!.userId },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        bio: true,
        skills: true,
        updatedAt: true,
      },
    });

    res.json({ status: 'success', data: { user } });
  } catch (err) {
    next(err);
  }
}

/** GET /api/users (RECRUITER only) */
export async function listCandidates(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 20));
    const skip = (page - 1) * limit;

    const [candidates, total] = await Promise.all([
      prisma.user.findMany({
        where: { role: 'CANDIDATE' },
        select: {
          id: true,
          email: true,
          name: true,
          avatar: true,
          bio: true,
          skills: true,
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where: { role: 'CANDIDATE' } }),
    ]);

    res.json({
      status: 'success',
      data: { candidates, pagination: { page, limit, total, pages: Math.ceil(total / limit) } },
    });
  } catch (err) {
    next(err);
  }
}
