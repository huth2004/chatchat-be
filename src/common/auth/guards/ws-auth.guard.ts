import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Socket } from 'socket.io';
import { WsAuthService } from '../services/ws-auth.service';

@Injectable()
export class WsAuthGuard implements CanActivate {
  constructor(private readonly wsAuthService: WsAuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: Socket = context.switchToWs().getClient();
    try {
      await this.wsAuthService.authenticate(client);
    } catch (error) {
      throw new UnauthorizedException('Unauthorized', { cause: error });
    }
    return true;
  }
}
