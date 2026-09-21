import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';

export interface JwtAuthPayload {
  user: { userId: string; [key: string]: unknown };
  [key: string]: unknown;
}

@Injectable()
export class JwtAuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  private getAccessTokenSecret(): string {
    const secret = this.configService.get<string>('JWT_ACCESS_SECRET');
    if (!secret) {
      throw new Error('JWT_ACCESS_SECRET is not defined in the configuration');
    }
    return secret;
  }

  private getAccessTokenExpiration(): number {
    const expiration = this.configService.get<number>('JWT_ACCESS_EXPIRATION');
    if (expiration === undefined) {
      throw new Error(
        'JWT_ACCESS_EXPIRATION is not defined in the configuration',
      );
    }
    return expiration;
  }

  private getRefreshTokenSecret(): string {
    const secret = this.configService.get<string>('JWT_REFRESH_SECRET');
    if (!secret) {
      throw new Error('JWT_REFRESH_SECRET is not defined in the configuration');
    }
    return secret;
  }

  private getRefreshTokenExpiration(): number {
    const expiration = this.configService.get<number>('JWT_REFRESH_EXPIRATION');
    if (expiration === undefined) {
      throw new Error(
        'JWT_REFRESH_EXPIRATION is not defined in the configuration',
      );
    }
    return expiration;
  }

  async signAccessToken(authPayload: JwtAuthPayload): Promise<string> {
    const options: JwtSignOptions = {
      secret: this.getAccessTokenSecret(),
      expiresIn: this.getAccessTokenExpiration(),
    };

    return this.jwtService.signAsync(authPayload, options);
  }

  async verifyAccessToken(token: string): Promise<JwtAuthPayload> {
    try {
      const secret = this.getAccessTokenSecret();
      return await this.jwtService.verifyAsync(token, { secret });
    } catch (error) {
      console.error('Lỗi xác thực access token:', error);
      throw new Error('Access token không hợp lệ hoặc đã hết hạn', {
        cause: error,
      });
    }
  }

  async signRefreshToken(authPayload: JwtAuthPayload): Promise<string> {
    const options: JwtSignOptions = {
      secret: this.getRefreshTokenSecret(),
      expiresIn: this.getRefreshTokenExpiration(),
    };

    return this.jwtService.signAsync(authPayload, options);
  }

  async verifyRefreshToken(token: string): Promise<JwtAuthPayload> {
    try {
      const secret = this.getRefreshTokenSecret();
      return await this.jwtService.verifyAsync(token, { secret });
    } catch (error) {
      console.error('Lỗi xác thực refresh token:', error);
      throw new Error('Refresh token không hợp lệ hoặc đã hết hạn', {
        cause: error,
      });
    }
  }
}
