import { BaseMapper } from '@/infrastructure/database/persistence/base.mapper';
import { DirectChat } from '@/domains/chat/entities/direct-chat.entity';
import { DirectChatInfrastructure } from '@/infrastructure/database/persistence/chat/entities/direct-chat-infra.entity';

export class DirectChatMapper implements BaseMapper<
  DirectChat,
  DirectChatInfrastructure
> {
  toDomainEntity(infraEntity: DirectChatInfrastructure): DirectChat {
    return {
      id: infraEntity.id,
      conversationId: infraEntity.conversationId,
      userId1: infraEntity.userId1,
      userId2: infraEntity.userId2,
      createdAt: infraEntity.createdAt,
      updatedAt: infraEntity.updatedAt,
      isDeleted: infraEntity.isDeleted,
      deletedAt: infraEntity.deletedAt,
    };
  }
  toInfraEntity(domainEntity: DirectChat): DirectChatInfrastructure {
    return {
      id: domainEntity.id,
      conversationId: domainEntity.conversationId,
      userId1: domainEntity.userId1,
      userId2: domainEntity.userId2,
      createdAt: domainEntity.createdAt,
      updatedAt: domainEntity.updatedAt,
      isDeleted: domainEntity.isDeleted,
      deletedAt: domainEntity.deletedAt,
    };
  }
}
