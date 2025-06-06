import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { AppConfigModule } from './app-config/app-config.module';
import { MathSolveModule } from './math-solve/math-solve.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [configuration],
        }),
        AppConfigModule,
        MathSolveModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
