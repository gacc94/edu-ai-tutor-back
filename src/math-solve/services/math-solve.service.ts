import { Injectable } from '@nestjs/common';

@Injectable()
export class MathSolveService {
    constructor() {}

    solveMathProblem(prompt: string) {
        return 'Solving math problem...';
    }
}
