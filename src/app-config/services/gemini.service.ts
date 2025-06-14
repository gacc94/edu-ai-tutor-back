import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { AppConfigService } from './app-config.service';
import { GoogleGenAI } from '@google/genai';

@Injectable()
export class GeminiService implements OnModuleInit {
    private readonly logger = new Logger(GeminiService.name);

    private _gemini: GoogleGenAI;
    private _modelName: string;

    constructor(private readonly appConfigService: AppConfigService) {}

    onModuleInit() {
        this.logger.log('Initializing GeminiService...');

        const apiKey = this.appConfigService.get('gemini.apiKey');
        this._modelName = this.appConfigService.get('gemini.model');

        if (!apiKey) throw new Error('GEMINI_API_KEY is not configured. Cannot initialize GeminiService.');

        this._gemini = new GoogleGenAI({ apiKey });
        this.logger.log(`GeminiService initialized successfully with model: ${this._modelName}`);
    }

    /**
     * Getter para acceder a la instancia singleton del cliente de Gemini.
     * @returns La instancia de GoogleGenAI
     */
    get client(): GoogleGenAI {
        if (!this._gemini) throw new Error('GeminiService has not been initialized properly.');
        return this._gemini;
    }

    /**
     * Getter para acceder al nombre del modelo configurado.
     * @returns El nombre del modelo como string
     */
    get modelName(): string {
        return this._modelName;
    }
}
