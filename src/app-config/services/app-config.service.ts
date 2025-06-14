import { Injectable, Logger } from '@nestjs/common';
import { ConfigService, Path, PathValue } from '@nestjs/config';
import { AppConfig } from 'src/app-config/schemas/env-schema';

@Injectable()
export class AppConfigService {
    private readonly logger = new Logger(AppConfigService.name);

    constructor(private readonly configService: ConfigService<AppConfig, true>) {
        this.logger.log('AppConfigService initialized');
    }

    /**
     * Obtiene un valor de configuración tipado usando una ruta de acceso (ej: 'server.port')
     * @param key Ruta de la clave de configuración
     * @returns El valor de configuración fuertemente tipado
     */
    get<P extends Path<AppConfig>>(key: P): PathValue<AppConfig, P> {
        const value = this.configService.get(key, { infer: true });

        if (value === undefined) {
            const errorMessage = `Configuration key "${key}" not found or is undefined.`;
            this.logger.error(errorMessage);
            throw new Error(errorMessage);
        }

        return value as PathValue<AppConfig, P>;
    }
}
