import { app } from './app.js';
import { connectDatabase, disconnectDatabase } from './config/database.js';
import { env } from './config/env.js';

let server;
let isShuttingDown = false;

async function startServer() {
  try {
    await connectDatabase();

    server = app.listen(env.port, () => {
      console.log(`NetPulse API listening on port ${env.port}`);
    });

    server.keepAliveTimeout = 5000;
    server.headersTimeout = 6000;
  } catch (error) {
    console.error('Failed to start NetPulse API.');
    console.error(error.message);
    process.exit(1);
  }
}

async function gracefulShutdown(signal) {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;
  console.log(`Received ${signal}. Shutting down NetPulse API...`);

  const forceExitTimer = setTimeout(() => {
    console.error('Graceful shutdown timed out. Exiting.');
    process.exit(1);
  }, env.shutdownTimeoutMs);

  forceExitTimer.unref();

  if (server) {
    await new Promise((resolve, reject) => {
      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      });
    });
  }

  await disconnectDatabase();
  clearTimeout(forceExitTimer);
  console.log('NetPulse API shutdown complete.');
  process.exit(0);
}

process.on('SIGINT', () => {
  void gracefulShutdown('SIGINT');
});

process.on('SIGTERM', () => {
  void gracefulShutdown('SIGTERM');
});

void startServer();

