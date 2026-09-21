import { Injectable, Inject } from '@nestjs/common';
import { ConversationRepository } from '@/infrastructure/database/persistence/chat/repositories/conversation.reposiory';
import { DirectChatRepository } from '@/infrastructure/database/persistence/chat/repositories/direct-chat.repository';
import { MessageRepository } from '@/infrastructure/database/persistence/chat/repositories/message.reposiory';
import { UserRepository } from '@/infrastructure/database/persistence/user/repositories/user.repository';
import { DirectChat } from '@/domains/chat/entities/direct-chat.entity';
import { ConversationItem } from '@/domains/chat/usecase/conversation-item.entity';
import { LastMessage } from '@/domains/chat/usecase/last-message.entity';

export interface GetConversationInput {
  userId: string;
  conversationId: string;
}

@Injectable()
export class GetConversationUseCase {
  constructor(
    @Inject('CONVERSATION_REPOSITORY')
    private readonly conversationRepository: ConversationRepository,
    @Inject('DIRECT_CHAT_REPOSITORY')
    private readonly directChatRepository: DirectChatRepository,
    @Inject('MESSAGE_REPOSITORY')
    private readonly messageRepository: MessageRepository,
    @Inject('USER_REPOSITORY') private readonly userRepository: UserRepository,
  ) {}

  async execute(input: GetConversationInput): Promise<ConversationItem> {
    const { userId, conversationId } = input;

    const directChat: DirectChat | null =
      await this.directChatRepository.findByUserIdAndConversationId(
        userId,
        conversationId,
      );

    if (!directChat) {
      throw new Error(
        'Direct chat not found for the given user and conversation',
      );
    }

    let title: string = 'Unknown';
    let avatarUrl: string | null = null;
    let lastMessage: LastMessage | null = null;

    const conversationData = await this.conversationRepository.findById(
      directChat.conversationId,
    );

    const lastMessageData =
      await this.messageRepository.findLastMessageByConversationId(
        conversationId,
      );

    if (lastMessageData) {
      const sender = await this.userRepository.findById(
        lastMessageData.senderId,
      );
      lastMessage = {
        senderId: lastMessageData.senderId,
        senderName: sender ? sender.username : 'Unknown',
        content: lastMessageData.content,
        timestamp: lastMessageData.createdAt,
      };
    }

    if (conversationData && conversationData.type === 'direct') {
      const partnerId =
        directChat?.userId1 === userId
          ? directChat.userId2
          : directChat?.userId1;

      const partner = await this.userRepository.findById(partnerId || '');

      title = partner ? partner.username : 'Unknown';
      avatarUrl = null;
    }

    return {
      ...conversationData!,
      title: title,
      avatarUrl: avatarUrl,
      lastMessage: lastMessage,
    };
  }
}
