export function successResponse(data, message) {
  return {
    success: true,
    data,
    ...(message ? { message } : {})
  };
}

export function errorResponse(code, message, details = []) {
  return {
    success: false,
    error: {
      code,
      message,
      details
    }
  };
}

