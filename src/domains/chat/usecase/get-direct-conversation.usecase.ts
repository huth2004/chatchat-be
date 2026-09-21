import { Injectable, Inject } from '@nestjs/common';
import { DirectChatRepository } from '@/infrastructure/database/persistence/chat/repositories/direct-chat.repository';
import { MessageRepository } from '@/infrastructure/database/persistence/chat/repositories/message.reposiory';
import { UserRepository } from '@/infrastructure/database/persistence/user/repositories/user.repository';
import { Message } from '@/domains/chat/entities/message.entity';
import { DirectChat } from '@/domains/chat/entities/direct-chat.entity';

import { MessageItem } from './message-item.entity';
import { DirectConversation } from './direct-conversation.entity';

export interface GetDirectConversationInput {
  userId: string;
  conversationId: string;
}

@Injectable()
export class GetDirectConversationUseCase {
  constructor(
    @Inject('DIRECT_CHAT_REPOSITORY')
    private readonly directChatRepository: DirectChatRepository,
    @Inject('MESSAGE_REPOSITORY')
    private readonly messageRepository: MessageRepository,
    @Inject('USER_REPOSITORY') private readonly userRepository: UserRepository,
  ) {}

  async execute(
    input: GetDirectConversationInput,
  ): Promise<DirectConversation> {
    const { userId, conversationId } = input;

    const directChat: DirectChat | null =
      await this.directChatRepository.findByUserIdAndConversationId(
        userId,
        conversationId,
      );

    if (!directChat) {
      throw new Error('Direct conversation not found');
    }

    const partnerId =
      directChat.userId1 === userId ? directChat.userId2 : directChat.userId1;

    const partner = await this.userRepository.findById(partnerId);

    if (!partner) {
      throw new Error('Partner user not found');
    }

    const messages: Message[] =
      await this.messageRepository.findAllMessagesByConversationId(
        directChat.conversationId,
      );

    const messageItems: MessageItem[] = await Promise.all(
      messages.map(async (message) => {
        const sender = await this.userRepository.findById(message.senderId);
        return {
          ...message,
          senderName: sender?.username || 'Unknown',
          senderAvatarUrl: null,
        };
      }),
    );

    return {
      id: directChat.conversationId,
      partnerId: partner.id,
      title: partner.username,
      avatarUrl: null,
      messages: messageItems,
    };
  }
}
