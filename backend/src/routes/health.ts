import { Router, Request, Response } from 'express';

export const router = Router();

router.get('/', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'skillsync-backend',
    timestamp: new Date().toISOString(),
  });
});
