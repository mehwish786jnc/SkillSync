import { Router } from 'express';
import { getRooms, getMessages, getOnlineStatus } from '../controllers/chat.controller';
import { authenticate } from '../middleware/auth';

export const router = Router();

// All chat REST routes require authentication
router.use(authenticate);

router.get('/rooms', getRooms);
router.get('/rooms/:roomId/messages', getMessages);
router.get('/online', getOnlineStatus);
