import { Request } from 'express';

export interface IApiResponse<T> {
    statusCode: number;
    message?: string;
    data?: T;
    metadata?: {
        timestamp: string;
        path?: string;
        [key: string]: any;
    };
    error?: string | object;
}

export interface IApiResponseOptions {
    message?: string;
    metadata?: Record<string, any>;
    statusCode?: number;
}

export function formatResponse<T>(data: T, options: IApiResponseOptions = {}): IApiResponse<T> {
    const { message, metadata = {}, statusCode = 200 } = options;

    return {
        statusCode,
        message,
        data,
        metadata: {
            timestamp: new Date().toISOString(),
            ...metadata,
        },
    };
}

export function formatErrorResponse(error: Error | string, statusCode: number = 500, req?: Request): IApiResponse<null> {
    const errorMessage = error instanceof Error ? error.message : error;

    return {
        statusCode,
        error: errorMessage,
        data: null,
        metadata: {
            timestamp: new Date().toISOString(),
            path: req?.url,
        },
    };
}
