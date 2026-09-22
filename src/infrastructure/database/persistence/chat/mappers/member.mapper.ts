import { BaseMapper } from '@/infrastructure/database/persistence/base.mapper';
import { Member } from '@/domains/chat/entities/member.entity';
import { MemberInfrastructure } from '@/infrastructure/database/persistence/chat/entities/member-infra.entity';

export class MemberMapper implements BaseMapper<Member, MemberInfrastructure> {
  toDomainEntity(infraEntity: MemberInfrastructure): Member {
    return {
      id: infraEntity.id,
      conversationId: infraEntity.conversationId,
      userId: infraEntity.userId,
      role: infraEntity.role,
      createdAt: infraEntity.createdAt,
      updatedAt: infraEntity.updatedAt,
      isDeleted: infraEntity.isDeleted,
      deletedAt: infraEntity.deletedAt,
    };
  }
  toInfraEntity(domainEntity: Member): MemberInfrastructure {
    return {
      id: domainEntity.id,
      conversationId: domainEntity.conversationId,
      userId: domainEntity.userId,
      role: domainEntity.role,
      createdAt: domainEntity.createdAt,
      updatedAt: domainEntity.updatedAt,
      isDeleted: domainEntity.isDeleted,
      deletedAt: domainEntity.deletedAt,
    };
  }
}
