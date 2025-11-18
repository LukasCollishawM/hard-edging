import type { AssetSchema, PrivacyWarning } from './types';

const warnings: PrivacyWarning[] = [];

export const getPrivacyWarnings = (): PrivacyWarning[] => [...warnings];

export const clearPrivacyWarnings = (): void => {
  warnings.length = 0;
};

export const assertShareablePayload = <T>(
  schema: AssetSchema<T> | null,
  payload: unknown,
): asserts payload is T => {
  if (!schema) {
    const warning: PrivacyWarning = {
      code: 'UNANNOTATED_SHARE',
      message:
        'Attempted to share payload over P2P without explicit schema. Hard-Edging strongly suggests you annotate your assets.',
      assetName: 'unknown',
    };
    warnings.push(warning);
    throw new Error(warning.message);
  }

  const result = schema.zod.safeParse(payload);
  if (!result.success) {
    const warning: PrivacyWarning = {
      code: 'POLICY_VIOLATION',
      message: `Payload does not conform to schema ${schema.name}`,
      assetName: schema.name,
    };
    warnings.push(warning);
    throw new Error(warning.message);
  }

  if (schema.policy === 'private') {
    const warning: PrivacyWarning = {
      code: 'POLICY_VIOLATION',
      message: `Attempted to share asset ${schema.name} marked as private.`,
      assetName: schema.name,
    };
    warnings.push(warning);
    throw new Error(warning.message);
  }
};


