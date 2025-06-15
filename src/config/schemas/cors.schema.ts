import { z } from 'zod';

export const CorsSchema = z.object({
    enabled: z.boolean().default(true),
    origins: z.array(z.string()).default(['http://localhost:3000', 'http://localhost:3001']),
});
