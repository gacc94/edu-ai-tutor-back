import { z } from 'zod';

export const LoggingSchema = z.object({
    level: z.enum(['debug', 'info', 'warn', 'error']).default('debug'),
    format: z.enum(['combined', 'json']).default('combined'),
});
