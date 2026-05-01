import { Router } from 'express';
import {
  matchJobsForCandidate,
  matchCandidatesForJob,
  getMatchScore,
} from '../controllers/match.controller';
import { authenticate, authorize } from '../middleware/auth';

export const router = Router();

// All matching routes require authentication
router.use(authenticate);

// Candidate: find jobs that match my profile
router.get('/jobs', authorize('CANDIDATE'), matchJobsForCandidate);

// Candidate: get my score for a specific job
router.get('/score', authorize('CANDIDATE'), getMatchScore);

// Recruiter: find candidates that match a job
router.get('/candidates', authorize('RECRUITER'), matchCandidatesForJob);
