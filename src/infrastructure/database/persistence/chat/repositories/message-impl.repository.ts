import { Injectable } from '@nestjs/common';
import { MessageRepository } from '@/infrastructure/database/persistence/chat/repositories/message.reposiory';
import { Message } from '@/domains/chat/entities/message.entity';

import { MessageInfrastructure } from '../entities/message-infra.entity';
import { MessageMapper } from '../mappers/message.mapper';

const messages: MessageInfrastructure[] = [];

@Injectable()
export class MessageImplRepository implements MessageRepository {
  messageMapper: MessageMapper = new MessageMapper();

  findAll(): Promise<Message[]> {
    return Promise.resolve(
      messages.map((message) => this.messageMapper.toDomainEntity(message)),
    );
  }
  findById(id: string): Promise<Message | null> {
    return Promise.resolve(
      messages
        .filter((message) => message.id === id)
        .map((message) => this.messageMapper.toDomainEntity(message))[0] ||
        null,
    );
  }
  create(
    entity: Omit<
      Message,
      'id' | 'createdAt' | 'updatedAt' | 'isDeleted' | 'deletedAt'
    >,
  ): Promise<Message> {
    const newMessage: Message = {
      id: messages.length.toString(),
      createdAt: new Date(),
      updatedAt: null,
      isDeleted: false,
      deletedAt: null,
      ...entity,
    };
    messages.push(this.messageMapper.toInfraEntity(newMessage));
    return Promise.resolve(newMessage);
  }
  update(id: string, entity: Partial<Message>): Promise<Message | null> {
    const index = messages.findIndex((message) => message.id === id);
    if (index === -1) {
      return Promise.resolve(null);
    }
    const updatedMessage: MessageInfrastructure = {
      ...messages[index],
      ...entity,
      updatedAt: new Date(),
    };
    messages[index] = updatedMessage;
    return Promise.resolve(this.messageMapper.toDomainEntity(updatedMessage));
  }
  delete(id: string): Promise<boolean> {
    const index = messages.findIndex((message) => message.id === id);
    if (index === -1) {
      return Promise.resolve(false);
    }
    messages.splice(index, 1);
    return Promise.resolve(true);
  }

  findLastByConversationId(conversationId: string): Promise<Message | null> {
    const conversationMessages = messages.filter(
      (message) => message.conversationId === conversationId,
    );
    if (conversationMessages.length === 0) {
      return Promise.resolve(null);
    }
    const lastMessage = conversationMessages[conversationMessages.length - 1];
    return Promise.resolve(this.messageMapper.toDomainEntity(lastMessage));
  }

  findAllByConversationId(conversationId: string): Promise<Message[]> {
    const conversationMessages = messages.filter(
      (message) => message.conversationId === conversationId,
    );
    return Promise.resolve(
      conversationMessages.map((message) =>
        this.messageMapper.toDomainEntity(message),
      ),
    );
  }
}
