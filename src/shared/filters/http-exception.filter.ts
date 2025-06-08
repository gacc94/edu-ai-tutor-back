import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { IApiResponse } from '../interfaces/api-response.interface';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(HttpExceptionFilter.name);

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';
        let error: string | object = message;

        // Ensure error is always defined as string or object
        const getError = (err: unknown): string | object => {
            if (typeof err === 'string') return err;
            if (err instanceof Error) return err.message || 'Unknown error';
            if (err && typeof err === 'object') return err;
            return message;
        };

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const response = exception.getResponse();

            if (typeof response === 'string') {
                message = response;
                error = response;
            } else if (typeof response === 'object') {
                message = (response as any).message || message;
                error = response;
            }
        } else if (exception instanceof Error) {
            message = exception.message;
            error = exception.stack || exception.message;
        }

        // Ensure error is properly typed
        error = getError(error);

        // Log the error
        this.logger.error(
            `Http Status: ${status} Error: ${JSON.stringify(error)}`,
            exception instanceof Error ? exception.stack : '',
        );

        // Format the error response
        const errorResponse: IApiResponse<null> = {
            statusCode: status,
            message,
            error: error || message, // Ensure error is always a string or object
            data: null,
            metadata: {
                timestamp: new Date().toISOString(),
                path: request.url,
                method: request.method,
            },
        };

        response.status(status).json(errorResponse);
    }
}
