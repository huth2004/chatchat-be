import { Injectable } from '@nestjs/common';
import { ConversationRepository } from '@/infrastructure/database/persistence/chat/repositories/conversation.reposiory';
import { Conversation } from '@/domains/chat/entities/conversation.entity';

import { ConversationInfrastructure } from '../entities/conversation-infra.entity';
import { ConversationMapper } from '../mappers/conversation.mapper';

const conversations: ConversationInfrastructure[] = [];

@Injectable()
export class ConversationImplRepository implements ConversationRepository {
  conversationMapper: ConversationMapper = new ConversationMapper();

  findAll(): Promise<Conversation[]> {
    return Promise.resolve(
      conversations.map((conversation) =>
        this.conversationMapper.toDomainEntity(conversation),
      ),
    );
  }
  findById(id: string): Promise<Conversation | null> {
    return Promise.resolve(
      conversations
        .filter((conversation) => conversation.id === id)
        .map((conversation) =>
          this.conversationMapper.toDomainEntity(conversation),
        )[0] || null,
    );
  }
  create(
    entity: Omit<
      Conversation,
      'id' | 'createdAt' | 'updatedAt' | 'isDeleted' | 'deletedAt'
    >,
  ): Promise<Conversation> {
    const newConversation: Conversation = {
      id: conversations.length.toString(),
      createdAt: new Date(),
      updatedAt: null,
      isDeleted: false,
      deletedAt: null,
      ...entity,
    };
    conversations.push(this.conversationMapper.toInfraEntity(newConversation));
    return Promise.resolve(newConversation);
  }
  update(
    id: string,
    entity: Partial<
      Omit<
        Conversation,
        'id' | 'createdAt' | 'updatedAt' | 'isDeleted' | 'deletedAt'
      >
    >,
  ): Promise<Conversation | null> {
    const index = conversations.findIndex(
      (conversation) => conversation.id === id,
    );
    if (index === -1) {
      return Promise.resolve(null);
    }
    const updatedConversation: ConversationInfrastructure = {
      ...conversations[index],
      ...entity,
      updatedAt: new Date(),
    };
    conversations[index] = updatedConversation;

    return Promise.resolve(
      this.conversationMapper.toDomainEntity(updatedConversation),
    );
  }
  delete(id: string): Promise<boolean> {
    const index = conversations.findIndex(
      (conversation) => conversation.id === id,
    );

    if (index === -1) {
      return Promise.resolve(false);
    }

    conversations.splice(index, 1);
    return Promise.resolve(true);
  }

  findAllByIds(
    ids: string[],
    type?: 'direct' | 'group',
  ): Promise<Conversation[]> {
    const filteredConversations = conversations.filter(
      (conversation) =>
        ids.includes(conversation.id) && (!type || conversation.type === type),
    );
    return Promise.resolve(
      filteredConversations.map((conversation) =>
        this.conversationMapper.toDomainEntity(conversation),
      ),
    );
  }
}
