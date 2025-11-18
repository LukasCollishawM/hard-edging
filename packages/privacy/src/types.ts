import type { AssetPolicy } from '@hard-edging/core';
import type { ZodTypeAny } from 'zod';

export interface AssetSchema<T> {
  name: string;
  policy: AssetPolicy;
  zod: ZodTypeAny;
}

export interface PrivacyWarning {
  code: 'UNANNOTATED_SHARE' | 'POLICY_VIOLATION';
  message: string;
  assetName: string;
}


