import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfigService } from './app-config/app-config.service';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const config = app.get(AppConfigService);

    // Usando el método de conveniencia para obtener la configuración del servidor
    const { port, host } = config.getServerConfig();
    const { name } = config.getEnvName();

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
