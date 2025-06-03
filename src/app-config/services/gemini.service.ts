import { Injectable } from '@nestjs/common';
import { AppConfigService } from './app-config.service';
import { GeminiConfig } from 'src/config/schema';
import { GoogleGenAI } from '@google/genai';

@Injectable()
export class GeminiService {
    private readonly geminiConfig: GeminiConfig;

    constructor(private readonly appConfigService: AppConfigService) {
        this.geminiConfig = this.appConfigService.get('gemini');
    }

    get gemini(): GoogleGenAI {
        const { apiKey } = this.geminiConfig;
        return new GoogleGenAI({ apiKey });
    }
}
