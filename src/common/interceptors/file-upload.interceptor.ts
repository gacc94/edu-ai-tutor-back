import { Injectable, NestInterceptor, ExecutionContext, CallHandler, OnModuleInit } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { Observable } from 'rxjs';
import { memoryStorage } from 'multer';

@Injectable()
export class FileUploadInterceptor implements NestInterceptor, OnModuleInit {
    private filesInterceptor: NestInterceptor;

    onModuleInit(): void {
        this.filesInterceptor = new (FilesInterceptor('files', 10, this._createDefaultConfig()))();
    }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> | Promise<any> {
        return this.filesInterceptor.intercept(context, next);
    }

    /*
     * ========================================================================================
     *                                      PRIVATE METHODS
     * ========================================================================================
     */

    private _createDefaultConfig(): MulterOptions {
        return {
            storage: memoryStorage(),
            /*storage: diskStorage({
                destination: join(`${process.cwd()}/uploads`),
                filename: (req, file, cb) => {
                    cb(null, Date.now() + '-' + file.originalname);
                },
            }),*/
            limits: {
                fileSize: 5 * 1024 * 1024, // 5MB
            },
            fileFilter: (req, file, cb) => {
                const allowedMimeTypes =
                    /image\/jpeg|image\/png|image\/gif|application\/pdf|application\/msword|application\/vnd.openxmlformats-officedocument.wordprocessingml.document/;

                if (!file.mimetype.match(allowedMimeTypes)) {
                    return cb(new Error('Only image, PDF, and Word files are allowed!'), false);
                }
                cb(null, true);
            },
        };
    }
}
