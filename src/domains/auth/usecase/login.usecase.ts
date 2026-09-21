import { Injectable, Inject } from '@nestjs/common';
import {
  JwtAuthService,
  JwtAuthPayload,
} from '@/common/auth/services/jwt-auth.service';
import { RefreshTokenRepository } from '@/infrastructure/database/persistence/auth/repositories/refresh-token.repository';
import { UserRepository } from '@/infrastructure/database/persistence/user/repositories/user.repository';
import { AuthToken } from './auth-token.entity';

import bcrypt from 'bcrypt-ts';

export interface LoginInput {
  username: string;
  password: string;
}

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly jwtAuthService: JwtAuthService,
    @Inject('REFRESH_TOKEN_REPOSITORY')
    private readonly refreshTokenRepository: RefreshTokenRepository,
    @Inject('USER_REPOSITORY') private readonly userRepository: UserRepository,
  ) {}
  async execute(input: LoginInput): Promise<AuthToken> {
    const { username, password } = input;

    const user = await this.userRepository.findByUsername(username);

    if (!user) {
      throw new Error('Username or password is incorrect');
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      throw new Error('Username or password is incorrect');
    }

    const jwtAuthPayload: JwtAuthPayload = {
      user: { userId: user.id, username: user.username, role: user.role },
    };

    const accessToken =
      await this.jwtAuthService.signAccessToken(jwtAuthPayload);

    const refreshToken =
      await this.jwtAuthService.signRefreshToken(jwtAuthPayload);

    if (!accessToken || !refreshToken) {
      throw new Error('Failed to generate tokens.');
    }

    const createdRefreshToken = await this.refreshTokenRepository.create({
      userId: user.id,
      token: refreshToken,
      isRevoked: false,
      expiresAt: new Date('01/01/2100'),
    });

    if (!createdRefreshToken) {
      throw new Error('Failed to create refresh token.');
    }

    return {
      accessToken,
      refreshToken: createdRefreshToken.token,
      expiresAt: createdRefreshToken.expiresAt,
    };
  }
}
