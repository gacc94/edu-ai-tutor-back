import { z } from 'zod';

export const EnvSchema = z.object({
    name: z.enum(['dev', 'prod']),
});
