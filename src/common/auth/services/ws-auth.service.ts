import { Injectable } from '@nestjs/common';
import { JwtAuthService, JwtAuthPayload } from './jwt-auth.service';
import { Socket } from 'socket.io';

export type AuthenticatedSocket = Socket & JwtAuthPayload;

@Injectable()
export class WsAuthService {
  constructor(private jwtAuthService: JwtAuthService) {}

  async authenticate(client: Socket): Promise<void> {
    const token = this.extractTokenFromHandshake(client);
    if (!token) {
      throw new Error('Token không được cung cấp trong handshake');
    }

    try {
      const payload: JwtAuthPayload =
        await this.jwtAuthService.verifyAccessToken(token);

      client['user'] = payload.user;
    } catch (error) {
      console.error('Lỗi xác thực token:', error);
      throw new Error('Token không hợp lệ hoặc đã hết hạn', { cause: error });
    }
  }

  private extractTokenFromHandshake(client: Socket): string | undefined {
    const auth = client.handshake.auth as {
      token?: string;
      [key: string]: unknown;
    };

    const token = auth?.token;

    if (typeof token === 'string' && token.trim()) {
      return token.replace(/^Bearer\s+/i, '').trim();
    }
  }
}
