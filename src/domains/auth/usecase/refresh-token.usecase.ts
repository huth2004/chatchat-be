import { Injectable, Inject } from '@nestjs/common';
import {
  JwtAuthService,
  JwtAuthPayload,
} from '@/common/auth/services/jwt-auth.service';
import { RefreshTokenRepository } from '@/infrastructure/database/persistence/auth/repositories/refresh-token.repository';
import { AuthToken } from './auth-token.entity';

export interface RefreshTokenInput {
  token: string;
}

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    @Inject('REFRESH_TOKEN_REPOSITORY')
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly jwtAuthService: JwtAuthService,
  ) {}

  async execute(input: RefreshTokenInput): Promise<AuthToken> {
    const { token } = input;
    const refreshToken = await this.refreshTokenRepository.findByToken(token);

    if (!refreshToken) {
      throw new Error('Refresh token not found.');
    }

    const isTokenRevoked = refreshToken.isRevoked;
    const isTokenExpired = refreshToken.expiresAt < new Date();

    if (isTokenRevoked || isTokenExpired) {
      await this.refreshTokenRepository.revokeToken(token);
      throw new Error('Refresh token is invalid or expired.');
    }

    const jwtAuthPayload: JwtAuthPayload = {
      user: { userId: refreshToken.userId },
    };

    const newAccessToken =
      await this.jwtAuthService.signAccessToken(jwtAuthPayload);
    const newRefreshToken =
      await this.jwtAuthService.signRefreshToken(jwtAuthPayload);

    if (!newAccessToken || !newRefreshToken) {
      throw new Error('Failed to generate new tokens.');
    }

    await this.refreshTokenRepository.revokeToken(token);

    const createdRefreshToken = await this.refreshTokenRepository.create({
      userId: refreshToken.userId,
      token: newRefreshToken,
      isRevoked: false,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    if (!createdRefreshToken) {
      throw new Error('Failed to create new refresh token.');
    }

    return {
      accessToken: newAccessToken,
      refreshToken: createdRefreshToken.token,
      expiresAt: createdRefreshToken.expiresAt,
    };
  }
}
