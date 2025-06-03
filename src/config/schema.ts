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

const GeminiSchema = z.object({
    apiKey: z.string(),
    model: z.string(),
    maxTokens: z.number(),
    temperature: z.number(),
    topP: z.number(),
    frequencyPenalty: z.number(),
    presencePenalty: z.number(),
    stopSequences: z.array(z.string()),
});

// Esquema principal
export const AppConfigSchema = z.object({
    server: ServerSchema,
    database: DatabaseSchema,
    env: EnvSchema,
    gemini: GeminiSchema,
});

// Tipos inferidos
export type ServerConfig = z.infer<typeof ServerSchema>;
export type DatabaseConfig = z.infer<typeof DatabaseSchema>;
export type EnvConfig = z.infer<typeof EnvSchema>;
export type GeminiConfig = z.infer<typeof GeminiSchema>;
export type AppConfig = z.infer<typeof AppConfigSchema>;
