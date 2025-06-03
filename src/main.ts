import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfigService } from './app-config/app-config.service';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const config = app.get(AppConfigService);

    // Usando el método de conveniencia para obtener la configuración del servidor
    const { port, host } = config.getServerConfig();

    app.setGlobalPrefix('api/v1');
    app.enableCors({
        origin: '*',
        credentials: true,
    });

    await app.listen(port);
    console.log(`Application is running on: ${host}:${port}`);
    console.log(`Environment: ${config.get('env.name')}`);
}

bootstrap();
