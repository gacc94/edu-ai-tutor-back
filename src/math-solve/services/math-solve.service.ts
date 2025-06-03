import { Injectable } from '@nestjs/common';
import { MathSolveUseCase } from '../uses-cases/math-solve.use-case';

@Injectable()
export class MathSolveService {
    constructor(private readonly mathSolveUseCase: MathSolveUseCase) {}

    solveMathProblem(prompt: string) {
        return this.mathSolveUseCase.execute(prompt);
    }
}
