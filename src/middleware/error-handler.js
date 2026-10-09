import { errorResponse } from '../utils/http-responses.js';

export function errorHandler(error, _request, response, _next) {
  if (response.headersSent) {
    return;
  }

  const statusCode = Number.isInteger(error.statusCode) ? error.statusCode : 500;
  const clientMessage =
    statusCode >= 500 ? 'An unexpected server error occurred.' : error.message;

  response.status(statusCode).json(
    errorResponse(error.code ?? 'INTERNAL_SERVER_ERROR', clientMessage)
  );
}

