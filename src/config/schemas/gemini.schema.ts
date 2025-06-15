import { z } from 'zod';

export const GeminiSchema = z.object({
    apiKey: z.string(),
    model: z.string().default('gemini-2.5-flash-preview-05-20'),
    maxTokens: z.number().default(1000),
    temperature: z.number().default(0.7),
    topP: z.number().default(0.9),
    frequencyPenalty: z.number().default(0),
    presencePenalty: z.number().default(0),
    stopSequences: z.array(z.string()).default([]),
});
