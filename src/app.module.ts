import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OperationsGateway } from './operations/operations.gateway';

@Module({
  imports: [
    // Cargar variables de entorno
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    
    // Configuración para servir archivos estáticos
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/',
      exclude: ['/api/*', '/*.js', '/*.css', '/*.json'],
      serveStaticOptions: {
        index: 'index.html',
        redirect: false,
        setHeaders: (res, path) => {
          // Configurar los headers correctos para los archivos estáticos
          if (path.endsWith('.js')) {
            res.set('Content-Type', 'application/javascript');
          } else if (path.endsWith('.css')) {
            res.set('Content-Type', 'text/css');
          }
        }
      }
    }),
  ],
  controllers: [AppController],
  providers: [AppService, OperationsGateway],
})
export class AppModule {}
