import { Injectable, Inject, Logger } from '@nestjs/common';
import { ConversationRepository } from '@/infrastructure/database/persistence/chat/repositories/conversation.reposiory';
import { MemberRepository } from '@/infrastructure/database/persistence/chat/repositories/member.repository';
import { MessageRepository } from '@/infrastructure/database/persistence/chat/repositories/message.reposiory';
import { UserRepository } from '@/infrastructure/database/persistence/user/repositories/user.repository';
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
    @Inject('MEMBER_REPOSITORY')
    private readonly memberRepository: MemberRepository,
    @Inject('MESSAGE_REPOSITORY')
    private readonly messageRepository: MessageRepository,
    @Inject('USER_REPOSITORY') private readonly userRepository: UserRepository,
  ) {}

  async execute(input: GetConversationInput): Promise<ConversationItem | null> {
    const { userId, conversationId } = input;

    const conversationData =
      await this.conversationRepository.findById(conversationId);

    if (!conversationData) {
      return null;
    }

    let title: string;
    let lastMessage: LastMessage | null = null;

    const lastMessageData =
      await this.messageRepository.findLastByConversationId(conversationId);

    if (lastMessageData) {
      const sender = await this.userRepository.findById(
        lastMessageData.senderId,
      );
      lastMessage = {
        senderId: lastMessageData.senderId,
        senderName: sender ? sender.username : 'Deleted User',
        content: lastMessageData.content,
        timestamp: lastMessageData.createdAt,
      };
    }

    const membersData =
      await this.memberRepository.findAllByConversationId(conversationId);

    const otherMemberIds = membersData
      .filter((member) => member.userId !== userId)
      .map((member) => member.userId);

    if (conversationData.type === 'direct') {
      if (otherMemberIds.length !== 1) {
        Logger.warn(
          `Data anomaly: Expected 1 other member in direct conversation ${conversationId}, found ${otherMemberIds.length}`,
        );
      }

      const partner = await this.userRepository.findById(otherMemberIds[0]);

      title = partner ? partner.username : 'Deleted User';
    } else {
      if (otherMemberIds.length < 2) {
        Logger.warn(
          `Data anomaly: Expected at least 2 other members in group conversation ${conversationId}, found ${otherMemberIds.length}`,
        );
      }

      if (!conversationData.name) {
        Logger.warn(
          `Data anomaly: Group conversation ${conversationId} has no name`,
        );
        title = 'Unnamed Group';
      } else {
        title = conversationData.name;
      }
    }

    return {
      ...conversationData,
      title,
      lastMessage,
    };
  }
}
