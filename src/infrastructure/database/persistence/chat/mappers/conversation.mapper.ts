import { BaseMapper } from '@/infrastructure/database/persistence/base.mapper';
import { Conversation } from '@/domains/chat/entities/conversation.entity';
import { ConversationInfrastructure } from '@/infrastructure/database/persistence/chat/entities/conversation-infra.entity';

export class ConversationMapper implements BaseMapper<
  Conversation,
  ConversationInfrastructure
> {
  toDomainEntity(infraEntity: ConversationInfrastructure): Conversation {
    return {
      id: infraEntity.id,
      type: infraEntity.type,
      createdAt: infraEntity.createdAt,
      updatedAt: infraEntity.updatedAt,
      isDeleted: infraEntity.isDeleted,
      deletedAt: infraEntity.deletedAt,
    };
  }
  toInfraEntity(domainEntity: Conversation): ConversationInfrastructure {
    return {
      id: domainEntity.id,
      type: domainEntity.type,
      createdAt: domainEntity.createdAt,
      updatedAt: domainEntity.updatedAt,
      isDeleted: domainEntity.isDeleted,
      deletedAt: domainEntity.deletedAt,
    };
  }
}
