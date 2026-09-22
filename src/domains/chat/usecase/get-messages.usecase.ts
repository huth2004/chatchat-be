import { Injectable, Inject } from '@nestjs/common';
import { MemberRepository } from '@/infrastructure/database/persistence/chat/repositories/member.repository';
import { MessageRepository } from '@/infrastructure/database/persistence/chat/repositories/message.reposiory';
import { UserRepository } from '@/infrastructure/database/persistence/user/repositories/user.repository';
import { MessageItem } from '@/domains/chat/usecase/message-item.entity';

export interface GetMessagesInput {
  userId: string;
  conversationId: string;
  limit?: number;
  cursor?: string;
}

@Injectable()
export class GetMessagesUseCase {
  constructor(
    @Inject('MEMBER_REPOSITORY')
    private readonly memberRepository: MemberRepository,
    @Inject('MESSAGE_REPOSITORY')
    private readonly messageRepository: MessageRepository,
    @Inject('USER_REPOSITORY') private readonly userRepository: UserRepository,
  ) {}

  async execute(input: GetMessagesInput): Promise<{
    data: MessageItem[];
    metadata: { nextCursor: string | null; hasMore: boolean };
  }> {
    const { userId, conversationId } = input;

    if (!userId || !conversationId) {
      throw new Error('User ID and Conversation ID are required');
    }

    const member = await this.memberRepository.findByUserIdAndConversationId(
      userId,
      conversationId,
    );

    if (!member) {
      throw new Error('User is not a member of the conversation');
    }

    const messagesData =
      await this.messageRepository.findAllByConversationId(conversationId);

    const messages: MessageItem[] = await Promise.all(
      messagesData.map(async (message): Promise<MessageItem> => {
        const sender = await this.userRepository.findById(message.senderId);
        return {
          ...message,
          senderUsername: sender ? sender.username : 'Deleted User',
          senderAvatarUrl: sender ? sender.avatarUrl : null,
        };
      }),
    );

    const limit = input.limit ?? 10;
    const cursor = input.cursor ?? Infinity;

    const paginatedMessages = messages
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .filter((message) => +message.id < +cursor)
      .slice(0, limit);

    let nextCursor: string | null = null;
    let hasMore: boolean = false;

    if (paginatedMessages.length > 0) {
      nextCursor = paginatedMessages[paginatedMessages.length - 1].id;
      hasMore = messages.some(
        (message) => nextCursor && message.id < nextCursor,
      );
    }

    return {
      data: paginatedMessages,
      metadata: {
        nextCursor,
        hasMore,
      },
    };
  }
}
