import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';
import { existsSync } from 'fs';
import { AppConfig, appSchema } from '../schemas/app.schema';
import { deepMerge } from 'src/shared/helpers/env.helpers';
import { loadConfigFromEnv } from './env.config';
import { ConfigFactory } from '@nestjs/config';

interface EnvConfigLoaderOptions {
    environmentName: 'dev' | 'prod';
}

export class EnvConfigLoader {
    constructor(private readonly options: EnvConfigLoaderOptions) {}

    async validateConfigAsync() {
        const config: Partial<AppConfig> = this._load();
        const { success, data, error } = await appSchema.safeParseAsync(config);

        if (!success) throw new Error(`Configuration validation failed: ${JSON.stringify(error.format())}`);

        return data;
    }

    /*
     * ========================================================================================
     *                                      PRIVATE METHODS
     * ========================================================================================
     */

    private _load(): AppConfig {
        const baseConfig = this._loadConfigFile('env.yml');
        const envConfig = this._loadConfigFile(`env.${this.options.environmentName}.yml`);
        const envVars = loadConfigFromEnv();
        return deepMerge(baseConfig, envConfig, envVars);
    }

    // --- MEJORA 3: Crear un método helper para no repetir la lógica de lectura de archivos ---
    private _loadConfigFile(fileName: string): Partial<AppConfig> {
        const configPath = join(process.cwd(), 'environments', fileName);

        return existsSync(configPath)
            ? (yaml.load(readFileSync(configPath, 'utf8')) as Partial<AppConfig>)
            : ({} as Partial<AppConfig>);
    }
}

export const config: ConfigFactory<AppConfig> = async () =>
    await new EnvConfigLoader({
        environmentName: process.env.NODE_ENV === 'prod' ? 'prod' : 'dev',
    }).validateConfigAsync();
