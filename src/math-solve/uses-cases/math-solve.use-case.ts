import { GeminiService } from 'src/app-config/services/gemini.service';
import { Injectable } from '@nestjs/common';

@Injectable({})
export class MathSolveUseCase {
    constructor(private readonly _ai: GeminiService) {}

    async execute(prompt: string) {
        const { models } = this._ai.gemini;
        const response = await models.generateContent({
            model: 'gemini-2.0-flash',
            contents: prompt,
        });
        return response;
    }
}
