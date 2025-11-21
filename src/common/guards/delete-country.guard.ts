import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class DeleteCountryGuard implements CanActivate {
  private readonly validToken = 'clave-delete';

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();

    const token = req.header('x-delete-token');

    if (!token) {
      throw new UnauthorizedException('Delete token is missing');
    }

    if (token !== this.validToken) {
      throw new UnauthorizedException('Invalid delete token');
    }

    return true;
  }
}
