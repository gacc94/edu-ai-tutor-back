import { GeminiService } from 'src/app-config/services/gemini.service';
import { Injectable } from '@nestjs/common';
import { createPartFromUri, createUserContent } from '@google/genai';
import { PROMPT_SYSTEM_MATH_SOLVE } from 'src/shared/constants';

@Injectable({})
export class MathSolveUseCase {
    constructor(private readonly _ai: GeminiService) {}

    async execute(prompt: string, files: Array<Express.Multer.File>) {
        const { models } = this._ai.gemini;
        const abortController = new AbortController();

        // Convert Buffer to Blob
        const image = await Promise.all(files.map((file) => this.uploadImageToGemini(file)));

        const response = await models.generateContent({
            model: 'gemini-2.5-flash-preview-05-20',
            contents: [
                createUserContent([prompt]),
                ...image.map((image) => createUserContent([createPartFromUri(image.uri!, image.mimeType!)])),
            ],
            config: {
                systemInstruction: PROMPT_SYSTEM_MATH_SOLVE,
                abortSignal: abortController.signal,
            },
        });
        abortController.abort();
        return {
            data: {
                content: response.candidates?.[0].content?.parts?.[0].text,
            },
        };
    }

    async uploadImageToGemini(file: Express.Multer.File) {
        const blob = new Blob([file.buffer], { type: file.mimetype });

        const image = await this._ai.gemini.files.upload({
            file: blob,
            config: {
                mimeType: file.mimetype,
            },
        });

        return image;
    }
}
