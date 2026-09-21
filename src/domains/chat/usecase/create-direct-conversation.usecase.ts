import { Injectable, Inject } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ConversationRepository } from '@/infrastructure/database/persistence/chat/repositories/conversation.reposiory';
import { DirectChatRepository } from '@/infrastructure/database/persistence/chat/repositories/direct-chat.repository';
import { UserRepository } from '@/infrastructure/database/persistence/user/repositories/user.repository';
import { DirectChat } from '@/domains/chat/entities/direct-chat.entity';

export interface CreateDirectConversationInput {
  userId: string;
  partnerId: string;
}

@Injectable()
export class CreateDirectConversationUseCase {
  constructor(
    @Inject('CONVERSATION_REPOSITORY')
    private readonly conversationRepository: ConversationRepository,
    @Inject('DIRECT_CHAT_REPOSITORY')
    private readonly directChatRepository: DirectChatRepository,
    @Inject('USER_REPOSITORY') private readonly userRepository: UserRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(input: CreateDirectConversationInput): Promise<string> {
    const { userId, partnerId } = input;

    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    const partner = await this.userRepository.findById(partnerId);

    if (!partner) {
      throw new Error('Partner not found');
    }

    const [userId1, userId2] = [userId, partnerId].sort();

    let directChat: DirectChat | null;

    directChat = await this.directChatRepository.findByUserIds(
      userId1,
      userId2,
    );

    if (directChat) {
      return directChat.conversationId;
    }

    const conversation = await this.conversationRepository.create({
      type: 'direct',
    });

    if (!conversation) {
      throw new Error('Failed to create conversation');
    }

    directChat = await this.directChatRepository.create({
      conversationId: conversation.id,
      userId1,
      userId2,
    });

    if (!directChat) {
      throw new Error('Failed to create direct chat');
    }

    this.eventEmitter.emit('conversation.created', {
      conversationId: conversation.id,
      userId,
      partnerId: userId === userId1 ? userId2 : userId1,
    });

    return directChat.conversationId;
  }
}
