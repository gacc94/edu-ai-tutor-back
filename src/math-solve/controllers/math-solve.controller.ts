import { Controller, Post, Body, UploadedFiles, UseInterceptors, Inject, HttpCode, HttpStatus } from '@nestjs/common';
import { MathSolveService } from '../services/math-solve.service';
import { MathSolveDto } from '../dtos/math-solve.dto';
import { MATH_SOLVE_SERVICE } from '../math-solve.tokens';
import { FileUploadInterceptor } from '../../common/interceptors/file-upload.interceptor';

@Controller('math-solve')
export class MathSolveController {
    constructor(@Inject(MATH_SOLVE_SERVICE) private readonly mathSolveService: MathSolveService) {}

    @HttpCode(HttpStatus.OK)
    @UseInterceptors(FileUploadInterceptor)
    @Post('chat')
    solveMathProblem(@UploadedFiles() files: Array<Express.Multer.File>, @Body() body: MathSolveDto) {
        return this.mathSolveService.solveMathProblem(body.prompt, files);
    }
}
