import { AppConfig } from 'src/config/schemas/app.schema';
import { getRequiredEnv, removeUndefinedValues } from '../../shared/helpers/env.helpers';

export const loadConfigFromEnv = (): AppConfig => {
    // Map environment variables to the nested structure expected by the app
    const envVars: Partial<AppConfig> = {
        server: {
            port: getRequiredEnv('PORT', 'number'),
            host: getRequiredEnv('HOST', 'string'),
        },
        env: {
            name: getRequiredEnv('NODE_ENV', 'string'),
        },
        database: {
            host: getRequiredEnv('DATABASE_HOST', 'string'),
            port: getRequiredEnv('DATABASE_PORT', 'number'),
            username: getRequiredEnv('DATABASE_USERNAME', 'string'),
            password: getRequiredEnv('DATABASE_PASSWORD', 'string'),
            database: getRequiredEnv('DATABASE_NAME', 'string'),
        },
        gemini: {
            apiKey: getRequiredEnv('GEMINI_API_KEY', 'string'),
            model: getRequiredEnv('GEMINI_MODEL', 'string'),
            maxTokens: getRequiredEnv('GEMINI_MAX_TOKENS', 'number'),
            temperature: getRequiredEnv('GEMINI_TEMPERATURE', 'number'),
            topP: getRequiredEnv('GEMINI_TOP_P', 'number'),
            frequencyPenalty: getRequiredEnv('GEMINI_FREQUENCY_PENALTY', 'number'),
            presencePenalty: getRequiredEnv('GEMINI_PRESENCE_PENALTY', 'number'),
            stopSequences: getRequiredEnv('GEMINI_STOP_SEQUENCES', 'string'),
        },
        logging: {
            level: getRequiredEnv('LOG_LEVEL', 'string'),
            format: getRequiredEnv('LOG_FORMAT', 'string'),
        },
    };

    // Devolvemos el objeto limpio, sin propiedades 'undefined'.
    return removeUndefinedValues(envVars);
};
