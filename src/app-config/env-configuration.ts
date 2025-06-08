import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';
import { existsSync } from 'fs';
import { AppConfig, AppConfigSchema } from './schemas/env-schema';

interface EnvironmentConfigLoaderOptions {
    environmentName: string;
}

class EnvironmentConfigLoader {
    constructor(private readonly options: EnvironmentConfigLoaderOptions) {}

    validateConfigSync(): Promise<AppConfig> {
        return new Promise((resolve, reject) => {
            const config = this._load();
            const parsed = AppConfigSchema.safeParse(config);
            if (!parsed.success) {
                reject(new Error(`Configuration validation failed: ${JSON.stringify(parsed.error.format())}`));
            }
            resolve(parsed.data as AppConfig);
        });
    }

    private _load(): AppConfig {
        const baseConfig = this._loadBaseConfig() as AppConfig;
        const envConfig = this._loadEnvConfig() as AppConfig;

        return { ...baseConfig, ...envConfig };
    }

    private _loadBaseConfig(): AppConfig {
        const envConfigPath = join(process.cwd(), `environments/env.yml`);
        return yaml.load(readFileSync(envConfigPath, 'utf8')) as AppConfig;
    }

    private _loadEnvConfig(): AppConfig {
        const envConfigPath = join(process.cwd(), `environments/env.${this.options.environmentName}.yml`);
        return existsSync(envConfigPath)
            ? (yaml.load(readFileSync(envConfigPath, 'utf8')) as AppConfig)
            : ({} as AppConfig);
    }
}

export default function createConfigLoader(options: EnvironmentConfigLoaderOptions) {
    return () => {
        const loader = new EnvironmentConfigLoader(options);
        return loader.validateConfigSync();
    };
}
