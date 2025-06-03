import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfigService } from './app-config/app-config.service';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const appConfig = app.get(AppConfigService);
    const port = appConfig.get<number>('server.port');
    const host = appConfig.get<string>('server.host');

    app.setGlobalPrefix('api/v1');
    app.enableCors({
        origin: '*',
        credentials: true,
    });

    await app.listen(port);
    console.log(`Application is running on: ${host}:${port}`);
}

bootstrap();
