import { Injectable } from '@nestjs/common';
import { DirectChatRepository } from '@/infrastructure/database/persistence/chat/repositories/direct-chat.repository';
import { DirectChat } from '@/domains/chat/entities/direct-chat.entity';
import { DirectChatInfrastructure } from '../entities/direct-chat-infra.entity';
import { DirectChatMapper } from '../mappers/direct-chat.mapper';

const directChats: DirectChatInfrastructure[] = [];

@Injectable()
export class DirectChatImplRepository implements DirectChatRepository {
  directChatMapper: DirectChatMapper = new DirectChatMapper();

  findAll(): Promise<DirectChat[]> {
    return Promise.resolve(
      directChats.map((directChat) =>
        this.directChatMapper.toDomainEntity(directChat),
      ),
    );
  }
  findById(id: string): Promise<DirectChat | null> {
    const directChat = directChats.find((directChat) => directChat.id === id);
    return Promise.resolve(
      directChat ? this.directChatMapper.toDomainEntity(directChat) : null,
    );
  }
  create(
    entity: Omit<
      DirectChat,
      'id' | 'createdAt' | 'updatedAt' | 'isDeleted' | 'deletedAt'
    >,
  ): Promise<DirectChat> {
    const newDirectChat: DirectChat = {
      id: directChats.length.toString(),
      createdAt: new Date(),
      updatedAt: null,
      isDeleted: false,
      deletedAt: null,
      ...entity,
    };
    directChats.push(this.directChatMapper.toInfraEntity(newDirectChat));
    return Promise.resolve(newDirectChat);
  }
  update(
    id: string,
    entity: Partial<
      Omit<
        DirectChat,
        'id' | 'createdAt' | 'updatedAt' | 'isDeleted' | 'deletedAt'
      >
    >,
  ): Promise<DirectChat | null> {
    const index = directChats.findIndex((directChat) => directChat.id === id);
    if (index === -1) {
      return Promise.resolve(null);
    }
    const updatedDirectChat: DirectChatInfrastructure = {
      ...directChats[index],
      ...entity,
      updatedAt: new Date(),
    };
    directChats[index] = updatedDirectChat;
    return Promise.resolve(
      this.directChatMapper.toDomainEntity(updatedDirectChat),
    );
  }
  delete(id: string): Promise<boolean> {
    const index = directChats.findIndex((directChat) => directChat.id === id);
    if (index === -1) {
      return Promise.resolve(false);
    }
    directChats.splice(index, 1);
    return Promise.resolve(true);
  }

  findByUserIds(userId1: string, userId2: string): Promise<DirectChat | null> {
    return Promise.resolve(
      directChats
        .filter(
          (directChat) =>
            directChat.userId1 === userId1 && directChat.userId2 === userId2,
        )
        .map((directChat) =>
          this.directChatMapper.toDomainEntity(directChat),
        )[0] || null,
    );
  }

  findAllByUserId(userId: string): Promise<DirectChat[]> {
    return Promise.resolve(
      directChats
        .filter(
          (directChat) =>
            directChat.userId1 === userId || directChat.userId2 === userId,
        )
        .map((directChat) => this.directChatMapper.toDomainEntity(directChat)),
    );
  }

  findByUserIdAndConversationId(
    userId: string,
    conversationId: string,
  ): Promise<DirectChat | null> {
    return Promise.resolve(
      directChats
        .filter(
          (directChat) =>
            directChat.conversationId === conversationId &&
            (directChat.userId1 === userId || directChat.userId2 === userId),
        )
        .map((directChat) =>
          this.directChatMapper.toDomainEntity(directChat),
        )[0] || null,
    );
  }
}
