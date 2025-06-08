import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';
import { existsSync } from 'fs';
import { AppConfig, AppConfigSchema } from './schema';

export default class EnvironmentConfigLoader {
    private readonly nodeEnv: string = process.env.NODE_ENV ?? 'dev';

    constructor() {}

    public load(): AppConfig {
        const baseConfig = this.loadBaseConfig();
        const envConfig = this.loadEnvConfig();

        return { ...baseConfig, ...envConfig };
    }

    private loadBaseConfig(): AppConfig {
        const envConfigPath = join(process.cwd(), `environments/env.yml`);
        return yaml.load(readFileSync(envConfigPath, 'utf8')) as AppConfig;
    }

    private loadEnvConfig() {
        const envConfigPath = join(process.cwd(), `environments/env.${this.nodeEnv}.yml`);
        return existsSync(envConfigPath)
            ? (yaml.load(readFileSync(envConfigPath, 'utf8')) as AppConfig)
            : ({} as AppConfig);
    }

    private validateConfigSync() {
        return new Promise((resolve, reject) => {
            const config = this.load();
            const parsed = AppConfigSchema.safeParse(config);
            if (!parsed.success) {
                reject(new Error(`Configuration validation failed: ${JSON.stringify(parsed.error.format())}`));
            }
            resolve(parsed.data);
        });
    }

    validateConfig() {
        return this.validateConfigSync();
    }
}
