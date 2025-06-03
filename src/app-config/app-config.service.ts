import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
    constructor(private readonly configService: ConfigService) {}

    get<T>(key: string): T {
        const value = this.configService.get<T>(key);
        if (!value) {
            throw new Error(`Configuration key "${key}" not found`);
        }
        return value;
    }
}
