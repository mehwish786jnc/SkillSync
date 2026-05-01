import { Router } from 'express';
import {
  applyToJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
  withdrawApplication,
} from '../controllers/application.controller';
import { authenticate, authorize } from '../middleware/auth';

export const router = Router();

// All application routes require auth
router.use(authenticate);

// Candidate routes
router.post('/', authorize('CANDIDATE'), applyToJob);
router.get('/my', authorize('CANDIDATE'), getMyApplications);
router.delete('/:id', authorize('CANDIDATE'), withdrawApplication);

// Recruiter routes
router.get('/job/:jobId', authorize('RECRUITER'), getJobApplications);
router.patch('/:id/status', authorize('RECRUITER'), updateApplicationStatus);
