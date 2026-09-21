import { Injectable } from '@nestjs/common';
import { JwtAuthService, JwtAuthPayload } from './jwt-auth.service';
import { Request } from 'express';

export type AuthenticatedRequest = Request & JwtAuthPayload;

@Injectable()
export class HttpAuthService {
  constructor(private jwtAuthService: JwtAuthService) {}

  async authenticate(request: Request): Promise<void> {
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new Error('Token không được cung cấp trong header Authorization');
    }

    try {
      const payload: JwtAuthPayload =
        await this.jwtAuthService.verifyAccessToken(token);

      request['user'] = payload.user;
    } catch (error) {
      console.error('Lỗi xác thực token:', error);
      throw new Error('Token không hợp lệ hoặc đã hết hạn', { cause: error });
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
