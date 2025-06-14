import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MathSolveModule } from './math-solve/math-solve.module';
import { SharedModule } from './shared/shared.module';
import createConfigLoader from './app-config/env-configuration';

const environment = process.env.NODE_ENV === 'prod' ? 'prod' : 'dev';

@Global()
@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [createConfigLoader({ environmentName: environment })],
        }),
        MathSolveModule,
        SharedModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
