import { z } from 'zod';
import { CorsSchema, DatabaseSchema, GeminiSchema, ServerSchema, EnvSchema, LoggingSchema } from '.';

// Esquema principal
export const appSchema = z.object({
    server: ServerSchema,
    database: DatabaseSchema,
    env: EnvSchema,
    gemini: GeminiSchema,
    logging: LoggingSchema,
    cors: CorsSchema,
});

// Tipos inferidos
export interface AppConfig extends z.infer<typeof appSchema> {}
