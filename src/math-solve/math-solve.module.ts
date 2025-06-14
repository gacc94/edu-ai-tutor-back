import { Module } from '@nestjs/common';
import { MathSolveController } from './controllers/math-solve.controller';
import { MathSolveService } from './services/math-solve.service';
import { MathSolveUseCase } from './uses-cases/math-solve.use-case';
import { GeminiService } from 'src/app-config/services/gemini.service';
import { AppConfigService } from 'src/app-config/services/app-config.service';
import { MATH_SOLVE_SERVICE } from './math-solve.tokens';

@Module({
    imports: [],
    providers: [
        MathSolveUseCase,
        GeminiService,
        AppConfigService,
        {
            provide: MATH_SOLVE_SERVICE,
            useFactory: (useCase: MathSolveUseCase) => new MathSolveService(useCase),
            inject: [MathSolveUseCase],
        },
    ],
    controllers: [MathSolveController],
    exports: [],
})
export class MathSolveModule {}
