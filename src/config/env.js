import 'dotenv/config';

function readInteger(name, fallback) {
  const rawValue = process.env[name];

  if (rawValue === undefined || rawValue === '') {
    return fallback;
  }

  const parsedValue = Number.parseInt(rawValue, 10);

  if (Number.isNaN(parsedValue)) {
    throw new Error(`${name} must be a valid integer.`);
  }

  return parsedValue;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: readInteger('PORT', 4000),
  mongodbUri: process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/netpulse',
  mongodbServerSelectionTimeoutMs: readInteger('MONGODB_SERVER_SELECTION_TIMEOUT_MS', 5000),
  mongodbMaxPoolSize: readInteger('MONGODB_MAX_POOL_SIZE', 10),
  corsOrigin: process.env.CORS_ORIGIN ?? '*',
  requestJsonLimit: process.env.REQUEST_JSON_LIMIT ?? '100kb',
  shutdownTimeoutMs: readInteger('SHUTDOWN_TIMEOUT_MS', 10000)
};

