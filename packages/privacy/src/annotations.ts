import { z, type ZodTypeAny } from 'zod';
import type { AssetSchema } from './types';

export const shareableSchema = <T extends ZodTypeAny>(
  name: string,
  schema: T,
): AssetSchema<z.infer<T>> => ({
  name,
  policy: 'shareable',
  zod: schema,
});

export const privateSchema = <T extends ZodTypeAny>(
  name: string,
  schema: T,
): AssetSchema<z.infer<T>> => ({
  name,
  policy: 'private',
  zod: schema,
});

export const roomLocalSchema = <T extends ZodTypeAny>(
  name: string,
  schema: T,
): AssetSchema<z.infer<T>> => ({
  name,
  policy: 'room-local',
  zod: schema,
});


