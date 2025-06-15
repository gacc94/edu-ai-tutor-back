import { AppConfig } from 'src/config/schemas/app.schema';
import { getRequiredEnv, removeUndefinedValues } from '../../shared/helpers/env.helpers';

export const loadConfigFromEnv = (): AppConfig => {
    // Map environment variables to the nested structure expected by the app
    const envVars: Partial<AppConfig> = {
        server: {
            port: Number(getRequiredEnv('PORT')),
            host: getRequiredEnv('HOST'),
        },
        env: {
            name: getRequiredEnv('NODE_ENV'),
        },
        database: {
            host: getRequiredEnv('DATABASE_HOST'),
            port: getRequiredEnv('DATABASE_PORT'),
            username: getRequiredEnv('DATABASE_USERNAME'),
            password: getRequiredEnv('DATABASE_PASSWORD'),
            database: getRequiredEnv('DATABASE_NAME'),
        },
        gemini: {
            apiKey: getRequiredEnv('GEMINI_API_KEY'),
            model: getRequiredEnv('GEMINI_MODEL'),
            maxTokens: Number(getRequiredEnv('GEMINI_MAX_TOKENS') ?? 1000),
            temperature: Number(getRequiredEnv('GEMINI_TEMPERATURE') ?? 0.8),
            topP: Number(getRequiredEnv('GEMINI_TOP_P') ?? 0.9),
            frequencyPenalty: Number(getRequiredEnv('GEMINI_FREQUENCY_PENALTY') ?? 0),
            presencePenalty: Number(getRequiredEnv('GEMINI_PRESENCE_PENALTY') ?? 0),
            stopSequences: getRequiredEnv('GEMINI_STOP_SEQUENCES'),
        },
        logging: {
            level: getRequiredEnv('LOG_LEVEL'),
            format: getRequiredEnv('LOG_FORMAT'),
        },
    };

    // Devolvemos el objeto limpio, sin propiedades 'undefined'.
    return removeUndefinedValues(envVars);
};
