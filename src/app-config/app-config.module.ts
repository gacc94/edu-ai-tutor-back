import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppConfigService } from './app-config.service';

@Module({
    imports: [ConfigModule],
    exports: [AppConfigService],
    providers: [AppConfigService],
})
export class AppConfigModule {}
