import { errorResponse } from '../utils/http-responses.js';

export function notFoundHandler(request, response) {
  return response.status(404).json(
    errorResponse('NOT_FOUND', `Route ${request.method} ${request.originalUrl} was not found.`)
  );
}

