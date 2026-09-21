import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { HttpAuthService } from '../services/http-auth.service';

@Injectable()
export class HttpAuthGuard implements CanActivate {
  constructor(private httpAuthService: HttpAuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    try {
      await this.httpAuthService.authenticate(request);
    } catch (error) {
      throw new UnauthorizedException('Unauthorized', { cause: error });
    }
    return true;
  }
}
