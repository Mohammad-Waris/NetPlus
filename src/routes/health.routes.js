import { Router } from 'express';
import { createHealthController } from '../controllers/health.controller.js';

export function createHealthRouter({ databaseStatusProvider }) {
  const router = Router();
  const healthController = createHealthController({ databaseStatusProvider });

  router.get('/health', healthController.getHealth);

  return router;
}

