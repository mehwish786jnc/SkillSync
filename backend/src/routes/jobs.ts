import { Router } from 'express';
import {
  listJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getMyJobs,
} from '../controllers/job.controller';
import { authenticate, authorize } from '../middleware/auth';

export const router = Router();

// Public routes
router.get('/', listJobs);
router.get('/:id', getJobById);

// Recruiter-only routes
router.post('/', authenticate, authorize('RECRUITER'), createJob);
router.get('/my/listings', authenticate, authorize('RECRUITER'), getMyJobs);
router.patch('/:id', authenticate, authorize('RECRUITER'), updateJob);
router.delete('/:id', authenticate, authorize('RECRUITER'), deleteJob);
