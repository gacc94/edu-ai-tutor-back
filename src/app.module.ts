import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MathSolveModule } from './math-solve/math-solve.module';
import { SharedModule } from './shared/shared.module';
import appConfig from './config/app.config';

@Global()
@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [appConfig],
        }),
        MathSolveModule,
        SharedModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
