import { BaseMapper } from '@/infrastructure/database/persistence/base.mapper';
import { RefreshToken } from '@/domains/auth/entities/refresh-token.entity';
import { RefreshTokenInfrastructure } from '../entities/refresh-token-infra.entity';

export class RefreshTokenMapper implements BaseMapper<
  RefreshToken,
  RefreshTokenInfrastructure
> {
  toDomainEntity(infraEntity: RefreshTokenInfrastructure): RefreshToken {
    return {
      userId: infraEntity.userId,
      token: infraEntity.token,
      isRevoked: infraEntity.isRevoked,
      expiresAt: infraEntity.expiresAt,
      id: infraEntity.id,
      createdAt: infraEntity.createdAt,
      updatedAt: infraEntity.updatedAt,
      isDeleted: infraEntity.isDeleted,
      deletedAt: infraEntity.deletedAt,
    };
  }
  toInfraEntity(domainEntity: RefreshToken): RefreshTokenInfrastructure {
    return {
      userId: domainEntity.userId,
      token: domainEntity.token,
      isRevoked: domainEntity.isRevoked,
      expiresAt: domainEntity.expiresAt,
      id: domainEntity.id,
      createdAt: domainEntity.createdAt,
      updatedAt: domainEntity.updatedAt,
      isDeleted: domainEntity.isDeleted,
      deletedAt: domainEntity.deletedAt,
    };
  }
}
