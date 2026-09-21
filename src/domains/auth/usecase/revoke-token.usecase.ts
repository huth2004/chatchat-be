import { Injectable, Inject } from '@nestjs/common';
import { RefreshTokenRepository } from '@/infrastructure/database/persistence/auth/repositories/refresh-token.repository';
import { RefreshTokenInput } from './refresh-token.usecase';

export interface RevokeTokenInput {
  token: string;
}

@Injectable()
export class RevokeTokenUseCase {
  constructor(
    @Inject('REFRESH_TOKEN_REPOSITORY')
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  async execute(input: RefreshTokenInput): Promise<void> {
    const { token } = input;
    const isRevoked = await this.refreshTokenRepository.revokeToken(token);
    if (!isRevoked) {
      throw new Error('Failed to revoke refresh token.');
    }
  }
}
