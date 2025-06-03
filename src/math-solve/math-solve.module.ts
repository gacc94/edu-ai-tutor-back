import { Module } from '@nestjs/common';
import { MathSolveController } from './controllers/math-solve.controller';
import { MathSolveService } from './services/math-solve.service';
import { MathSolveUseCase } from './uses-cases/math-solve.use-case';
import { GeminiService } from 'src/app-config/services/gemini.service';
import { AppConfigService } from 'src/app-config/services/app-config.service';

@Module({
    imports: [],
    providers: [MathSolveService, MathSolveUseCase, GeminiService, AppConfigService],
    controllers: [MathSolveController],
})
export class MathSolveModule {}
