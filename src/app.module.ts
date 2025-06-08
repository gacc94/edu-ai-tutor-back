import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AppConfigModule } from './app-config/app-config.module';
import { MathSolveModule } from './math-solve/math-solve.module';
import { SharedModule } from './shared/shared.module';
import EnvironmentConfigLoader from './config/configuration';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [async () => await new EnvironmentConfigLoader().validateConfig()],
        }),
        AppConfigModule,
        MathSolveModule,
        SharedModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
