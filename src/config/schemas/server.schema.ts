import { z } from 'zod';

// Esquemas base
export const ServerSchema = z.object({
    port: z.number().default(3000),
    host: z.string().default('localhost'),
});
