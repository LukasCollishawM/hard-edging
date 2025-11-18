import { describe, it, expect } from 'vitest';
import { createBroker } from './server';

describe('broker server', () => {
  it('exposes a health endpoint', async () => {
    const app = createBroker();
    const res = await app.inject({ method: 'GET', url: '/health' });
    expect(res.statusCode).toBe(200);
  });
});


