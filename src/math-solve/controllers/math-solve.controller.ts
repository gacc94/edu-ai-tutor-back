import { Controller, Post, Body } from '@nestjs/common';
import { MathSolveService } from '../services/math-solve.service';
import { MathSolveDto } from '../dtos/math-solve.dto';

@Controller('math-solve')
export class MathSolveController {
    constructor(private readonly mathSolveService: MathSolveService) {}

    @Post('chat')
    solveMathProblem(@Body() body: MathSolveDto) {
        return this.mathSolveService.solveMathProblem(body.prompt);
    }
}
