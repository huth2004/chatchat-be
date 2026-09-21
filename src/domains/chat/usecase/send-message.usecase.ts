import { Injectable, Inject } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ConversationRepository } from '@/infrastructure/database/persistence/chat/repositories/conversation.reposiory';
import { DirectChatRepository } from '@/infrastructure/database/persistence/chat/repositories/direct-chat.repository';
import { MessageRepository } from '@/infrastructure/database/persistence/chat/repositories/message.reposiory';
import { Conversation } from '@/domains/chat/entities/conversation.entity';
import { Message } from '@/domains/chat/entities/message.entity';
import { UserRepository } from '@/infrastructure/database/persistence/user/repositories/user.repository';
import { User } from '@/domains/user/entities/user.entity';

export interface SendMessageInput {
  userId: string;
  conversationId: string;
  content: string;
}

@Injectable()
export class SendMessageUseCase {
  constructor(
    @Inject('USER_REPOSITORY')
    private readonly userRepository: UserRepository,
    @Inject('CONVERSATION_REPOSITORY')
    private readonly conversationRepository: ConversationRepository,
    @Inject('DIRECT_CHAT_REPOSITORY')
    private readonly directChatRepository: DirectChatRepository,
    @Inject('MESSAGE_REPOSITORY')
    private readonly messageRepository: MessageRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(input: SendMessageInput): Promise<Message | undefined> {
    const { userId, conversationId, content } = input;

    const sender: User | null = await this.userRepository.findById(userId);

    if (!sender) {
      throw new Error('Sender not found.');
    }

    const conversation: Conversation | null =
      await this.conversationRepository.findById(conversationId);

    if (!conversation) {
      throw new Error('Conversation not found.');
    }

    if (conversation.type === 'group') {
      throw new Error(
        'Feature will be available for group conversations in the future.',
      );
    }

    const directChat =
      await this.directChatRepository.findByUserIdAndConversationId(
        userId,
        conversationId,
      );

    if (!directChat) {
      throw new Error('Direct chat not found.');
    }

    const createdMessage = await this.messageRepository.create({
      conversationId,
      senderId: userId,
      content,
    });

    if (!createdMessage) {
      throw new Error('Failed to create message.');
    }

    this.eventEmitter.emit('message.created', {
      id: String(createdMessage.id),
      conversationId: String(createdMessage.conversationId),
      senderId: String(createdMessage.senderId),
      content: createdMessage.content,
      timestamp: createdMessage.createdAt.toISOString(),
    });

    return createdMessage;
  }
}
