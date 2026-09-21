import { BaseRepository } from '../../base.repository';
import { RefreshToken } from '@/domains/auth/entities/refresh-token.entity';

export abstract class RefreshTokenRepository extends BaseRepository<RefreshToken> {
  abstract findByToken(token: string): Promise<RefreshToken | null>;
  abstract revokeToken(token: string): Promise<boolean>;
}
