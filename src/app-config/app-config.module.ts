import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppConfigService } from './services/app-config.service';
import { GeminiService } from './services/gemini.service';

@Module({
    imports: [ConfigModule],
    exports: [AppConfigService, GeminiService],
    providers: [AppConfigService, GeminiService],
})
export class AppConfigModule {}
