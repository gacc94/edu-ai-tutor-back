import { z } from 'zod';

// Esquemas base
const ServerSchema = z.object({
    port: z.number().default(3000),
    host: z.string().default('localhost'),
});

const DatabaseSchema = z.object({
    host: z.string(),
    port: z.number(),
    username: z.string(),
    password: z.string(),
    database: z.string(),
});

const EnvSchema = z.object({
    name: z.enum(['local', 'dev', 'prod', 'test']),
});

// Esquema principal
export const AppConfigSchema = z.object({
    server: ServerSchema,
    database: DatabaseSchema,
    env: EnvSchema,
});

// Tipos inferidos
export type AppConfig = z.infer<typeof AppConfigSchema>;
export type ServerConfig = z.infer<typeof ServerSchema>;
export type DatabaseConfig = z.infer<typeof DatabaseSchema>;
export type EnvConfig = z.infer<typeof EnvSchema>;
