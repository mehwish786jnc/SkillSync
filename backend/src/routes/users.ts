import { Router } from 'express';
import { getUserById, updateProfile, listCandidates } from '../controllers/user.controller';
import { authenticate, authorize } from '../middleware/auth';

export const router = Router();

// All user routes require authentication
router.use(authenticate);

router.get('/', authorize('RECRUITER'), listCandidates);
router.patch('/profile', updateProfile);
router.get('/:id', getUserById);
