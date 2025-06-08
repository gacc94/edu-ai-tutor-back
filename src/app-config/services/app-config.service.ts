import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from 'src/config/schema';

@Injectable()
export class AppConfigService {
    constructor(private readonly configService: ConfigService<AppConfig, true>) {}

    /**
     * Obtiene un valor de configuración tipado
     * @param key Ruta de la clave de configuración (ej: 'server.port')
     * @returns El valor de configuración tipado
     */
    get<T extends keyof AppConfig>(key: T): AppConfig[T] {
        const value = this.configService.get(key);
        if (value === undefined || value === null) {
            throw new Error(`Configuration key "${key}" not found`);
        }
        return value as AppConfig[T];
    }
}
