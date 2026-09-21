import { BaseMapper } from '@/infrastructure/database/persistence/base.mapper';
import { Message } from '@/domains/chat/entities/message.entity';
import { MessageInfrastructure } from '@/infrastructure/database/persistence/chat/entities/message-infra.entity';

export class MessageMapper implements BaseMapper<
  Message,
  MessageInfrastructure
> {
  toDomainEntity(infraEntity: MessageInfrastructure): Message {
    return {
      id: infraEntity.id,
      conversationId: infraEntity.conversationId,
      senderId: infraEntity.senderId,
      content: infraEntity.content,
      createdAt: infraEntity.createdAt,
      updatedAt: infraEntity.updatedAt,
      isDeleted: infraEntity.isDeleted,
      deletedAt: infraEntity.deletedAt,
    };
  }
  toInfraEntity(domainEntity: Message): MessageInfrastructure {
    return {
      id: domainEntity.id,
      conversationId: domainEntity.conversationId,
      senderId: domainEntity.senderId,
      content: domainEntity.content,
      createdAt: domainEntity.createdAt,
      updatedAt: domainEntity.updatedAt,
      isDeleted: domainEntity.isDeleted,
      deletedAt: domainEntity.deletedAt,
    };
  }
}
