import { GeminiService } from 'src/app-config/services/gemini.service';
import { Injectable } from '@nestjs/common';
import { createPartFromUri, createUserContent } from '@google/genai';
import { PROMPT_SYSTEM_MATH_SOLVE } from 'src/shared/constants';
import { File } from '@google/genai';
import { formatResponse } from 'src/shared/interfaces/api-response.interface';

@Injectable({})
export class MathSolveUseCase {
    constructor(private readonly _ai: GeminiService) {}

    /*
     * ========================================================================================
     *                                  PUBLIC METHODS
     * ========================================================================================
     */

    async execute(prompt: string, files: Array<Express.Multer.File>) {
        const images = await this._uploadImagesToGemini(files);
        const content = await this._generateContent(prompt, images);
        return content;
    }

    /*
     * ========================================================================================
     *                                  PRIVATE METHODS
     * ========================================================================================
     */

    private async _uploadImagesToGemini(files: Array<Express.Multer.File>): Promise<Array<File>> {
        return Promise.all(files.map((file) => this._uploadImageToGemini(file)));
    }

    private async _uploadImageToGemini(file: Express.Multer.File): Promise<File> {
        const blob = new Blob([file.buffer], { type: file.mimetype });
        const image: File = await this._ai.client.files.upload({
            file: blob,
            config: {
                mimeType: file.mimetype,
            },
        });
        return image;
    }

    private async _generateContent(prompt: string, images: Array<File>) {
        const abortController = new AbortController();
        const imageContent = images.map((image) => createUserContent([createPartFromUri(image.uri!, image.mimeType!)]));
        const response = await this._ai.client.models.generateContent({
            model: this._ai.modelName,
            contents: [createUserContent([prompt]), ...imageContent],
            config: {
                systemInstruction: PROMPT_SYSTEM_MATH_SOLVE,
                abortSignal: abortController.signal,
            },
        });
        abortController.abort();
        if (!response.candidates?.[0]?.content?.parts?.length) {
            throw new Error('No content generated');
        }
        return {
            content: response.candidates[0].content.parts[0].text,
            images,
        };
    }
}
