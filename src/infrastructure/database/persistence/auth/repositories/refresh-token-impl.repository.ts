import { Injectable } from '@nestjs/common';
import { RefreshTokenRepository } from './refresh-token.repository';
import { RefreshToken } from '@/domains/auth/entities/refresh-token.entity';
import { RefreshTokenInfrastructure } from '../entities/refresh-token-infra.entity';
import { RefreshTokenMapper } from '../mappers/refresh-token.mapper';

const refreshTokens: RefreshTokenInfrastructure[] = [];

@Injectable()
export class RefreshTokenImplRepository implements RefreshTokenRepository {
  refreshTokenMapper = new RefreshTokenMapper();

  findAll(): Promise<RefreshToken[]> {
    return new Promise((resolve) => {
      resolve(
        refreshTokens.map((infraEntity) =>
          this.refreshTokenMapper.toDomainEntity(infraEntity),
        ),
      );
    });
  }
  findById(id: string): Promise<RefreshToken | null> {
    return new Promise((resolve) => {
      const refreshToken = refreshTokens.find((rt) => rt.id === id);
      resolve(
        refreshToken
          ? this.refreshTokenMapper.toDomainEntity(refreshToken)
          : null,
      );
    });
  }
  create(
    entity: Omit<
      RefreshToken,
      'id' | 'createdAt' | 'updatedAt' | 'isDeleted' | 'deletedAt'
    >,
  ): Promise<RefreshToken> {
    return new Promise((resolve) => {
      const newRefreshToken: RefreshTokenInfrastructure = {
        id: Math.random().toString(36).substring(2, 9),
        ...entity,
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false,
        deletedAt: null,
      };
      refreshTokens.push(newRefreshToken);
      resolve(this.refreshTokenMapper.toDomainEntity(newRefreshToken));
    });
  }
  update(
    id: string,
    entity: Partial<
      Omit<
        RefreshToken,
        'id' | 'createdAt' | 'updatedAt' | 'isDeleted' | 'deletedAt'
      >
    >,
  ): Promise<RefreshToken | null> {
    return new Promise((resolve) => {
      const index = refreshTokens.findIndex((rt) => rt.id === id);
      if (index !== -1) {
        Object.assign(refreshTokens[index], entity, {
          updatedAt: new Date(),
        });
        resolve(this.refreshTokenMapper.toDomainEntity(refreshTokens[index]));
      } else {
        resolve(null);
      }
    });
  }
  delete(id: string): Promise<boolean> {
    return new Promise((resolve) => {
      const index = refreshTokens.findIndex((rt) => rt.id === id);
      if (index !== -1) {
        refreshTokens.splice(index, 1);
        resolve(true);
      } else {
        resolve(false);
      }
    });
  }

  findByToken(token: string): Promise<RefreshToken | null> {
    return new Promise((resolve) => {
      const refreshToken = refreshTokens.find((rt) => rt.token === token);
      resolve(
        refreshToken
          ? this.refreshTokenMapper.toDomainEntity(refreshToken)
          : null,
      );
    });
  }
  revokeToken(token: string): Promise<boolean> {
    return new Promise((resolve) => {
      const index = refreshTokens.findIndex((rt) => rt.token === token);
      if (index !== -1) {
        refreshTokens[index].isRevoked = true;
      }
      resolve(index !== -1);
    });
  }
}
