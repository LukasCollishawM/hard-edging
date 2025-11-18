import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { shareableSchema, privateSchema } from './annotations';
import { assertShareablePayload, clearPrivacyWarnings, getPrivacyWarnings } from './guards';

describe('privacy guards', () => {
  it('allows shareable payloads that match schema', () => {
    clearPrivacyWarnings();
    const schema = shareableSchema('ChatMessage', z.object({ text: z.string() }));
    const payload = { text: 'hello' };

    expect(() => assertShareablePayload(schema, payload)).not.toThrow();
    expect(getPrivacyWarnings()).toHaveLength(0);
  });

  it('rejects private payloads from being shared', () => {
    clearPrivacyWarnings();
    const schema = privateSchema('SecretNote', z.object({ text: z.string() }));
    const payload = { text: 'top secret' };

    expect(() => assertShareablePayload(schema, payload)).toThrow();
    expect(getPrivacyWarnings().length).toBeGreaterThan(0);
  });
});


