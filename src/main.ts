import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, ValidationPipeOptions } from '@nestjs/common';
import { json, urlencoded } from 'express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  console.log('Iniciando el backend...');

  const app = await NestFactory.create(AppModule);

  // Habilitar CORS
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Aumentar el límite de tamaño de las peticiones
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('Wrapper Frontend de Fyxtoken')
    .setDescription(`
      Envoltorio para ejecutar y actualizar el frontend de 
      Fyxtoken desde su build
    `.trim())
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    customSiteTitle: 'Wrapper Frontend Fyxtoken',
    customfavIcon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Circle-icons-dev.svg/250px-Circle-icons-dev.svg.png',
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js',
    ],
    customCssUrl: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.css',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.css',
    ],
    customCss: `
      .swagger-ui .topbar { display: none !important }
      .swagger-ui .info .title:after {
        content: "";
        display: block;
        margin: 10px 0;
        width: 100%;
        height: 200px;
        background-image: url("https://fyxtokentech.github.io/frontend-fyxtoken/img/metadata/logo-main.svg");
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
      }
      .swagger-ui { 
        .info .version, .scheme-container, small{
          display: none !important 
        }
      }
    `,
  });

  // Global pipe para validación
  const validationOptions: ValidationPipeOptions = {
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  };

  app.useGlobalPipes(new ValidationPipe(validationOptions));

  const port = process.env.PORT || 3000;

  await app.listen(port, '0.0.0.0', () => {
    console.log(`\n🚀 Servidor ejecutándose en:`);
    console.log(`   - Local: http://localhost:${port}`);
    console.log(`   - Network: http://${require('ip').address()}:${port}\n`);
  });
}

bootstrap().catch((err) => {
  console.error('Error al iniciar la aplicación:', err);
  process.exit(1);
});
