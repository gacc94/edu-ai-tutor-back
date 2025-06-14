import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ApiResponseInterceptor } from './interceptors/api-response.interceptor';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { AppConfigService } from 'src/app-config/services/app-config.service';

@Module({
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useFactory: () => new ApiResponseInterceptor(),
        },
        {
            provide: APP_FILTER,
            useClass: HttpExceptionFilter,
        },
    ],
    exports: [],
})
export class SharedModule {}
