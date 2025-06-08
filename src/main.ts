import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfigService } from './app-config/services/app-config.service';
import { ValidationPipe } from '@nestjs/common';
import { json, urlencoded } from 'express';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const config = app.get(AppConfigService);
    const { port, host } = config.get('server');
    const { name } = config.get('env');

    // Aumentar el límite de tamaño para archivos grandes si es necesario
    app.use(json({ limit: '50mb' }));
    app.use(urlencoded({ extended: true, limit: '50mb' }));

    app.setGlobalPrefix('api/v1');
    app.enableCors({
        origin: '*',
        credentials: true,
    });
    app.useGlobalPipes(new ValidationPipe());

    await app.listen(port);
    console.log(`Application is running on: ${host}:${port}`);
    console.log(`Environment: ${name}`);
}

bootstrap();
