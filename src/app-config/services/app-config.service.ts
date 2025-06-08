import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from 'src/app-config/schemas/env-schema';

@Injectable()
export class AppConfigService {
    constructor(private readonly configService: ConfigService<AppConfig, true>) {}

    /**
     * Obtiene un valor de configuración tipado
     * @param key Ruta de la clave de configuración (ej: 'server.port')
     * @returns El valor de configuración tipado
     */
    get<T extends keyof AppConfig>(key: T): AppConfig[T] {
        const value: AppConfig[T] = this.configService.get(key);
        if (value === undefined || value === null) {
            throw new Error(`Configuration key "${key}" not found`);
        }
        return value;
    }

    /**
     * Establece un valor de configuración tipado
     * @param key Ruta de la clave de configuración (ej: 'server.port')
     * @param value Valor de configuración
     */
    set<T extends keyof AppConfig>(key: T, value: AppConfig[T]): void {
        this.configService.set(key, value);
    }
}
