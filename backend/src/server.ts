import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config';
import logger from './config/logger';
import { router as healthRouter } from './routes/health';
import { router as authRouter } from './routes/auth';
import { router as usersRouter } from './routes/users';
import { router as jobsRouter } from './routes/jobs';
import { router as applicationsRouter } from './routes/applications';
import { router as matchingRouter } from './routes/matching';
import { router as chatRouter } from './routes/chat';
import { errorHandler } from './middleware/errorHandler';
import { initSocketServer } from './socket/chat';

const app = express();
const httpServer = createServer(app);

// Middleware
app.use(helmet());
app.use(cors({ origin: config.corsOrigin }));
app.use(morgan('dev'));
app.use(express.json({ limit: '10kb' }));

// Routes
app.use('/api/health', healthRouter);
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/jobs', jobsRouter);
app.use('/api/applications', applicationsRouter);
app.use('/api/matching', matchingRouter);
app.use('/api/chat', chatRouter);

// Error handling
app.use(errorHandler);

// Initialize Socket.io on the same HTTP server
initSocketServer(httpServer);

httpServer.listen(config.port, () => {
  logger.info(`Server running on http://localhost:${config.port} [${config.nodeEnv}]`);
});

export default app;
