import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const method = req.method;
    const originalUrl = req.originalUrl;

    // Tipar headers y body para que no sean any
    const headers = req.headers as Record<string, unknown>;
    const body = req.body as unknown;

    const start = Date.now();

    // Log básico de request
    console.log(
      `[Request] ${method} ${originalUrl} - ${new Date().toISOString()}`,
    );

    // Log de headers
    console.log('[Request Headers]', {
      'content-type': headers['content-type'],
      authorization: headers['authorization'],
      'user-agent': headers['user-agent'],
    });

    // Log de body solo si no está vacío y es un objeto
    if (
      body &&
      typeof body === 'object' &&
      Object.keys(body as Record<string, unknown>).length > 0
    ) {
      console.log('[Request Body]', body);
    }

    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(
        `[Response] ${method} ${originalUrl} - Status: ${
          res.statusCode
        } - ${duration}ms`,
      );
    });

    next();
  }
}
