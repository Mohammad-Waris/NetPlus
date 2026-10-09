import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import { getDatabaseStatus } from './config/database.js';
import { errorHandler } from './middleware/error-handler.js';
import { notFoundHandler } from './middleware/not-found.js';
import { createHealthRouter } from './routes/health.routes.js';

export function createApp(options = {}) {
  const app = express();
  const databaseStatusProvider = options.databaseStatusProvider ?? getDatabaseStatus;

  app.disable('x-powered-by');
  app.use(helmet());
  app.use(cors({ origin: env.corsOrigin }));
  app.use(express.json({ limit: env.requestJsonLimit }));
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 300,
      standardHeaders: true,
      legacyHeaders: false
    })
  );

  const enableRequestLogging = options.enableRequestLogging ?? env.nodeEnv !== 'test';

  if (enableRequestLogging) {
    app.use(morgan('dev'));
  }

  app.use('/api/v1', createHealthRouter({ databaseStatusProvider }));
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

export const app = createApp();

