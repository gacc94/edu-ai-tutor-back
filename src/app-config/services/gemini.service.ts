import { Injectable } from '@nestjs/common';
import { AppConfigService } from './app-config.service';
import { GoogleGenAI } from '@google/genai';

@Injectable()
export class GeminiService {
    constructor(private readonly appConfigService: AppConfigService) {}

    get gemini(): GoogleGenAI {
        const apiKey = this.appConfigService.get('gemini').apiKey;
        return new GoogleGenAI({ apiKey });
    }

    get model(): string {
        return this.appConfigService.get('gemini').model;
    }
}
