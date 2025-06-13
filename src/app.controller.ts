import {
  Controller,
  Get,
  Query,
  Res,
  Req,
  HttpException,
  HttpStatus,
  Post,
  Param,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { join } from 'path';
import * as fs from 'fs';
import { ApiOperation, ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';

import { CommandRunner } from './utils/command-runner';

@Controller()
@ApiTags('Principal')
export class AppController {
  @Post('api/app/get-front/sudo/:secretKey')
  @ApiOperation({ summary: 'Actualiza el frontend desde el repositorio' })
  @ApiResponse({
    status: 200,
    description: 'Frontend actualizado correctamente',
  })
  @ApiResponse({ status: 500, description: 'Error al actualizar el frontend' })
  @ApiParam({ name: 'secretKey', description: 'Clave secreta', required: true })
  async getFrontend(@Param('secretKey') secretKey: string) {
    if (secretKey !== 'fyx123') {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: 'Unauthorized',
          message: 'Invalid secret key',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
    try {
      console.log('Ejecutando comando: npm run get-front');
      const result = await CommandRunner.runCommand('npm run get-front');

      console.log('Resultado del comando:', {
        success: result.success,
        error: result.error,
        stderr: result.stderr,
        stdout: result.output,
      });

      if (!result.success) {
        const errorMessage =
          result.error || 'Error desconocido al ejecutar el comando';
        const errorDetails = {
          command: 'npm run get-front',
          error: errorMessage,
          stderr: result.stderr,
          stdout: result.output,
          cwd: process.cwd(),
        };

        console.error('Error al ejecutar el comando:', errorDetails);

        throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: 'Error al ejecutar el comando get-front',
            details: errorDetails,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return {
        success: true,
        message: 'Frontend actualizado correctamente',
        output: result.output,
      };
    } catch (error) {
      console.error('Error en getFrontend:', {
        message: error.message,
        stack: error.stack,
        error: error.response?.data || error,
      });

      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error al actualizar el frontend',
          message: error.message,
          details: error.response?.data || error,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('*')
  @ApiOperation({ summary: 'Sirve el frontend' })
  serveFrontend(@Res() res: Response, @Req() req: Request) {
    const path = req.path;

    const segments = path.split('/');
    const lastSegment = segments.pop() ?? '';
    const isStaticFile = lastSegment.includes('.');

    if (isStaticFile) {
      const filePath = join(__dirname, '..', 'public', path);
      if (fs.existsSync(filePath)) {
        return res.sendFile(filePath);
      }
      return res.status(404).json({
        success: false,
        error: 'Archivo no encontrado',
        path,
      });
    }

    return res.sendFile(join(__dirname, '..', 'public', 'index.html'));
  }
}
