import { Injectable, Inject } from '@nestjs/common';
import { ConversationRepository } from '@/infrastructure/database/persistence/chat/repositories/conversation.reposiory';
import { DirectChatRepository } from '@/infrastructure/database/persistence/chat/repositories/direct-chat.repository';
import { MessageRepository } from '@/infrastructure/database/persistence/chat/repositories/message.reposiory';
import { UserRepository } from '@/infrastructure/database/persistence/user/repositories/user.repository';
import { DirectChat } from '@/domains/chat/entities/direct-chat.entity';
import { ConversationItem } from '@/domains/chat/usecase/conversation-item.entity';
import { LastMessage } from '@/domains/chat/usecase/last-message.entity';

export interface GetConversationsInput {
  userId: string;
}

@Injectable()
export class GetConversationsUseCase {
  constructor(
    @Inject('CONVERSATION_REPOSITORY')
    private readonly conversationRepository: ConversationRepository,
    @Inject('DIRECT_CHAT_REPOSITORY')
    private readonly directChatRepository: DirectChatRepository,
    @Inject('MESSAGE_REPOSITORY')
    private readonly messageRepository: MessageRepository,
    @Inject('USER_REPOSITORY') private readonly userRepository: UserRepository,
  ) {}

  async execute(input: GetConversationsInput): Promise<ConversationItem[]> {
    const { userId } = input;
    const directChats: DirectChat[] =
      await this.directChatRepository.findAllByUserId(userId);

    const conversationIds = directChats.map(
      (directChat) => directChat.conversationId,
    );

    const conversationItems: ConversationItem[] = await Promise.all(
      conversationIds.map(async (conversationId): Promise<ConversationItem> => {
        let title: string = 'Unknown';
        let avatarUrl: string | null = null;
        let lastMessage: LastMessage | null = null;

        const conversationData =
          await this.conversationRepository.findById(conversationId);

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
          const directChat = directChats.find(
            (chat) => chat.conversationId === conversationId,
          );

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
      }),
    );

    return conversationItems;
  }
}
