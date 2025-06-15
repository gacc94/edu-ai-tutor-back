import { AppConfig } from 'src/config/schemas/app.schema';
import { getRequiredEnv, removeUndefinedValues } from '../../shared/helpers/env.helpers';

export const loadConfigFromEnv = (): AppConfig => {
    // Map environment variables to the nested structure expected by the app
    const envVars: Partial<AppConfig> = {
        server: {
            port: getRequiredEnv('PORT'),
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
            maxTokens: getRequiredEnv('GEMINI_MAX_TOKENS'),
            temperature: getRequiredEnv('GEMINI_TEMPERATURE'),
            topP: getRequiredEnv('GEMINI_TOP_P'),
            frequencyPenalty: getRequiredEnv('GEMINI_FREQUENCY_PENALTY'),
            presencePenalty: getRequiredEnv('GEMINI_PRESENCE_PENALTY'),
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
