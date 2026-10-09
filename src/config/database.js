import mongoose from 'mongoose';
import { env } from './env.js';

const connectionStates = {
  0: 'disconnected',
  1: 'connected',
  2: 'connecting',
  3: 'disconnecting'
};

export async function connectDatabase() {
  mongoose.set('strictQuery', true);

  await mongoose.connect(env.mongodbUri, {
    serverSelectionTimeoutMS: env.mongodbServerSelectionTimeoutMs,
    maxPoolSize: env.mongodbMaxPoolSize
  });

  return mongoose.connection;
}

export async function disconnectDatabase() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close(false);
  }
}

export function getDatabaseStatus() {
  const readyState = mongoose.connection.readyState;
  const state = connectionStates[readyState] ?? 'unknown';

  return {
    state,
    isConnected: readyState === 1
  };
}

