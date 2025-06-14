import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';
import { existsSync } from 'fs';
import { AppConfig, AppConfigSchema } from './schemas/env-schema';

interface EnvironmentConfigLoaderOptions {
    environmentName: 'dev' | 'prod';
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
        const envConfig = this._loadEnvConfig();
        return this._deepMerge(envConfig);
    }

    private _loadEnvConfig(): AppConfig {
        const { environmentName: envName } = this.options;
        const envConfigPath = join(process.cwd(), `environments/env.${envName}.yml`);
        return existsSync(envConfigPath)
            ? (yaml.load(readFileSync(envConfigPath, 'utf8')) as AppConfig)
            : ({} as AppConfig);
    }

    private _deepMerge(...objects: any[]) {
        const merge = (target: any, source: any) => {
            if (this.isObject(source)) {
                Object.keys(source).forEach((key) => {
                    if (this.isObject(source[key])) {
                        if (!target[key] || !this.isObject(target[key])) {
                            target[key] = {};
                        }
                        merge(target[key], source[key]);
                    } else {
                        target[key] = source[key];
                    }
                });
            }
            return target;
        };

        return objects.reduce((result: any, current: any) => merge(result, current), {});
    }

    private isObject(obj: any) {
        return obj && typeof obj === 'object' && !Array.isArray(obj);
    }
}

export default function createConfigLoader(options: EnvironmentConfigLoaderOptions) {
    return () => {
        const loader = new EnvironmentConfigLoader(options);
        return loader.validateConfigSync();
    };
}
