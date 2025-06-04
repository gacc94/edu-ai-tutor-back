import { Controller, Post, Body, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { MathSolveService } from '../services/math-solve.service';
import { MathSolveDto } from '../dtos/math-solve.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { join } from 'path';

@Controller('math-solve')
export class MathSolveController {
    constructor(private readonly mathSolveService: MathSolveService) {}

    @UseInterceptors(
        FilesInterceptor('files', 10, {
            storage: multer.memoryStorage(),
            limits: { fileSize: 5 * 1024 * 1024 },
            fileFilter: (req, file, cb) => {
                if (!file.originalname.match(/\.(jpg|jpeg|png|gif|pdf|doc|docx)$/)) {
                    return cb(new Error('Only image, PDF, Word files are allowed!'), false);
                }
                cb(null, true);
            },
        }),
    )
    // @UseInterceptors(
    //     FilesInterceptor('files', 10, {
    //         // 'files' es el nombre del campo y 10 es el máximo de archivos
    //         storage: multer.diskStorage({
    //             destination: join(`${process.cwd()}/uploads`),
    //             filename: (req, file, cb) => {
    //                 cb(null, Date.now() + '-' + file.originalname);
    //             },
    //         }),
    //         limits: {
    //             fileSize: 1024 * 1024 * 5,
    //         },
    //         fileFilter: (req, file, callback) => {
    //             if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    //                 return callback(new Error('Only image files are allowed!'), false);
    //             }
    //             callback(null, true);
    //         },
    //     }),
    // )
    @Post('chat')
    solveMathProblem(@UploadedFiles() files: Array<Express.Multer.File>, @Body() body: MathSolveDto) {
        return this.mathSolveService.solveMathProblem(body.prompt, files);
    }
}
