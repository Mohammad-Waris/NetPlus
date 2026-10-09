import { errorResponse, successResponse } from '../utils/http-responses.js';

export function createHealthController({ databaseStatusProvider }) {
  return {
    async getHealth(_request, response) {
      const checkedAt = new Date().toISOString();

      try {
        const databaseStatus = await databaseStatusProvider();

        if (!databaseStatus.isConnected) {
          return response.status(503).json(
            errorResponse('SERVICE_UNAVAILABLE', 'Service is unhealthy.', [
              {
                component: 'database',
                status: 'unavailable'
              }
            ])
          );
        }

        return response.status(200).json(
          successResponse({
            service: 'NetPulse API',
            status: 'healthy',
            checkedAt,
            database: {
              status: 'connected'
            }
          })
        );
      } catch {
        return response.status(503).json(
          errorResponse('SERVICE_UNAVAILABLE', 'Service is unhealthy.', [
            {
              component: 'database',
              status: 'unavailable'
            }
          ])
        );
      }
    }
  };
}

