import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpStatus, RequestMethod } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { formatResponse, IApiResponse } from '../interfaces/api-response.interface';
import { Request } from 'express';

@Injectable()
export class ApiResponseInterceptor<T> implements NestInterceptor<T, IApiResponse<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<IApiResponse<T>> {
        const httpContext = context.switchToHttp();
        const response = httpContext.getResponse();
        const request = httpContext.getRequest<Request>();
        const now = Date.now();

        return next.handle().pipe(
            map((data) => {
                // If the response is already formatted, return it as is
                if (data?.metadata?.timestamp) {
                    return data;
                }

                // Handle null/undefined data
                if (data === null || data === undefined) {
                    return formatResponse({} as T, {
                        statusCode: response.statusCode || HttpStatus.NO_CONTENT,
                        message: 'No content',
                        metadata: this.getMetadata(request, now),
                    });
                }

                // Handle string responses
                if (typeof data === 'string') {
                    return formatResponse({ message: data } as unknown as T, {
                        statusCode: response.statusCode || HttpStatus.OK,
                        message: data,
                        metadata: this.getMetadata(request, now),
                    });
                }

                // Handle object responses
                if (typeof data === 'object') {
                    const { message, ...rest } = data as any;
                    const statusCode = response.statusCode || this.getStatusCodeFromMethod(request.method);

                    return formatResponse(rest, {
                        statusCode,
                        message: message || this.getDefaultMessage(statusCode),
                        metadata: this.getMetadata(request, now),
                    });
                }

                // Fallback for other data types
                return formatResponse({ value: data } as unknown as T, {
                    statusCode: response.statusCode || HttpStatus.OK,
                    message: this.getDefaultMessage(response.statusCode),
                    metadata: this.getMetadata(request, now),
                });
            }),
        );
    }

    private getMetadata(request: Request, startTime: number) {
        return {
            timestamp: new Date().toISOString(),
            path: request.path,
            method: request.method,
            duration: `${Date.now() - startTime}ms`,
        };
    }

    private getStatusCodeFromMethod(method: string): number {
        switch (method.toUpperCase()) {
            case 'POST':
                return HttpStatus.CREATED;
            case 'DELETE':
                return HttpStatus.NO_CONTENT;
            default:
                return HttpStatus.OK;
        }
    }

    private getDefaultMessage(statusCode: number): string {
        switch (statusCode) {
            case HttpStatus.CREATED:
                return 'Resource created successfully';
            case HttpStatus.NO_CONTENT:
                return 'No content';
            default:
                return 'Request successful';
        }
    }
}
