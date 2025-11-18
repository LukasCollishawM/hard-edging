import { describe, it, expect } from 'vitest';

describe('cli entrypoint', () => {
  it('can be imported without throwing', async () => {
    const mod = await import('./index');
    expect(mod).toBeDefined();
  });
});


