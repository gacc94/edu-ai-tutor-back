import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';
import { existsSync } from 'fs';

export default () => {
    const nodeEnv = process.env.NODE_ENV || 'dev';
    const baseConfigPath = join(process.cwd(), 'environments/env.yml');
    const envConfigPath = join(process.cwd(), `environments/env.${nodeEnv}.yml`);

    // Cargar configuración base
    const baseConfig = yaml.load(readFileSync(baseConfigPath, 'utf8')) as Record<string, any>;

    // Cargar configuración de entorno específico si existe
    let envConfig = {};
    if (existsSync(envConfigPath)) {
        envConfig = yaml.load(readFileSync(envConfigPath, 'utf8')) as Record<string, any>;
    }

    // Combinar configuraciones (envConfig tiene prioridad sobre baseConfig)
    return { ...baseConfig, ...envConfig };
};
