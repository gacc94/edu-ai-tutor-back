import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ServerConfig, DatabaseConfig, ConfigKey, ConfigValue } from '../config/config.types';

@Injectable()
export class AppConfigService {
    constructor(private readonly configService: ConfigService) {}

    /**
     * Obtiene un valor de configuración tipado
     * @param key Ruta de la clave de configuración (ej: 'server.port')
     * @returns El valor de configuración tipado
     */
    get<T extends ConfigKey>(key: T): ConfigValue<T> {
        const value = this.configService.get(key);
        if (value === undefined || value === null) {
            throw new Error(`Configuration key "${key}" not found`);
        }
        return value as ConfigValue<T>;
    }

    // Métodos de conveniencia para acceder a secciones comunes
    getServerConfig(): ServerConfig {
        return this.get('server');
    }

    getDatabaseConfig(): DatabaseConfig {
        return this.get('database');
    }

    // Métodos específicos para propiedades comunes
    getServerPort(): number {
        return this.get('server.port');
    }

    getServerHost(): string {
        return this.get('server.host');
    }
}
