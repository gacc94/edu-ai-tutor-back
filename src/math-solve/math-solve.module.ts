import { Module } from '@nestjs/common';
import { MathSolveController } from './controllers/math-solve.controller';
import { MathSolveService } from './services/math-solve.service';

@Module({
    imports: [],
    providers: [MathSolveService],
    controllers: [MathSolveController],
    exports: [MathSolveService],
})
export class MathSolveModule {}
