import type { PrivacyWarning } from './types';

export const logPrivacyWarning = (warning: PrivacyWarning): void => {
  if (typeof console !== 'undefined') {
    // Straight-faced but slightly dramatic log message.
    // eslint-disable-next-line no-console
    console.warn(
      `[Hard-Edging][privacy] ${warning.code}: ${warning.message} (asset: ${warning.assetName})`,
    );
  }
};


