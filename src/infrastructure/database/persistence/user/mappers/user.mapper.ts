import { BaseMapper } from '@/infrastructure/database/persistence/base.mapper';
import { User } from '@/domains/user/entities/user.entity';
import { UserInfrastructure } from '../entities/user-infra.entity';

export class UserMapper implements BaseMapper<User, UserInfrastructure> {
  toDomainEntity(infraEntity: UserInfrastructure): User {
    return {
      id: infraEntity.id,
      username: infraEntity.username,
      password: infraEntity.password,
      role: infraEntity.role,
      createdAt: infraEntity.createdAt,
      updatedAt: infraEntity.updatedAt,
      isDeleted: infraEntity.isDeleted,
      deletedAt: infraEntity.deletedAt,
    };
  }
  toInfraEntity(domainEntity: User): UserInfrastructure {
    return {
      id: domainEntity.id,
      username: domainEntity.username,
      password: domainEntity.password,
      role: domainEntity.role,
      createdAt: domainEntity.createdAt,
      updatedAt: domainEntity.updatedAt,
      isDeleted: domainEntity.isDeleted,
      deletedAt: domainEntity.deletedAt,
    };
  }
}
