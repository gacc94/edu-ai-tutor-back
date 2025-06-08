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
    name: z.enum(['local', 'dev', 'prod']),
});

const GeminiSchema = z.object({
    apiKey: z.string(),
    model: z.string().default('gemini-2.5-flash-preview-05-20'),
    maxTokens: z.number().default(1000),
    temperature: z.number().default(0.7),
    topP: z.number().default(0.9),
    frequencyPenalty: z.number().default(0),
    presencePenalty: z.number().default(0),
    stopSequences: z.array(z.string()).default([]),
});

const LoggingSchema = z.object({
    level: z.enum(['debug', 'info', 'warn', 'error']).default('debug'),
    format: z.enum(['combined', 'json']).default('combined'),
});

const CorsSchema = z.object({
    enabled: z.boolean().default(true),
    origins: z.array(z.string()).default(['http://localhost:3000', 'http://localhost:3001']),
});

// Esquema principal
export const AppConfigSchema = z.object({
    server: ServerSchema,
    database: DatabaseSchema,
    env: EnvSchema,
    gemini: GeminiSchema,
    logging: LoggingSchema,
    cors: CorsSchema,
});

// Tipos inferidos
export type AppConfig = z.infer<typeof AppConfigSchema>;
