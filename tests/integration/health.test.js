import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import request from 'supertest';
import { createApp } from '../../src/app.js';

describe('GET /api/v1/health', () => {
  it('returns 200 when MongoDB is connected', async () => {
    const app = createApp({
      enableRequestLogging: false,
      databaseStatusProvider: () => ({
        state: 'connected',
        isConnected: true
      })
    });

    const response = await request(app).get('/api/v1/health');

    assert.equal(response.status, 200);
    assert.equal(response.body.success, true);
    assert.equal(response.body.data.status, 'healthy');
    assert.equal(response.body.data.database.status, 'connected');
  });

  it('returns 503 when MongoDB is unavailable', async () => {
    const app = createApp({
      enableRequestLogging: false,
      databaseStatusProvider: () => ({
        state: 'disconnected',
        isConnected: false
      })
    });

    const response = await request(app).get('/api/v1/health');

    assert.equal(response.status, 503);
    assert.equal(response.body.success, false);
    assert.equal(response.body.error.code, 'SERVICE_UNAVAILABLE');
    assert.equal(response.body.error.details[0].component, 'database');
    assert.equal(response.body.error.details[0].status, 'unavailable');
  });

  it('returns a client-safe 503 when the database status provider fails', async () => {
    const app = createApp({
      enableRequestLogging: false,
      databaseStatusProvider: () => {
        throw new Error('mongodb://user:password@example.internal/netpulse');
      }
    });

    const response = await request(app).get('/api/v1/health');

    assert.equal(response.status, 503);
    assert.equal(response.body.success, false);
    assert.equal(response.body.error.message, 'Service is unhealthy.');
    assert.equal(JSON.stringify(response.body).includes('password'), false);
    assert.equal(JSON.stringify(response.body).includes('example.internal'), false);
  });
});

