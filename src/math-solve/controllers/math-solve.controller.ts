import { Controller, Post, Body, UploadedFile, UseInterceptors } from '@nestjs/common';
import { MathSolveService } from '../services/math-solve.service';
import { MathSolveDto } from '../dtos/math-solve.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { join } from 'path';

@Controller('math-solve')
export class MathSolveController {
    constructor(private readonly mathSolveService: MathSolveService) {}

    @UseInterceptors(
        FileInterceptor('file', {
            storage: multer.diskStorage({
                destination: join(`${process.cwd()}/uploads`),
                filename: (req, file, cb) => {
                    cb(null, Date.now() + '-' + file.originalname);
                },
            }),
            limits: {
                fileSize: 1024 * 1024 * 5,
            },
            fileFilter: (req, file, callback) => {
                if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
                    return callback(new Error('Only image files are allowed!'), false);
                }
                callback(null, true);
            },
        }),
    )
    @Post('chat')
    solveMathProblem(@UploadedFile() file: Express.Multer.File, @Body() body: MathSolveDto) {
        console.log({ body, file });
        return {
            message: 'Math problem solved',
            body,
            file: {
                fileName: file.filename,
                originalName: file.originalname,
                size: file.size,
                encoding: file.encoding,
                mimetype: file.mimetype,
                path: file.path,
            },
        };
    }
}
