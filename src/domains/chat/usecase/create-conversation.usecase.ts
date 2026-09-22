import { Injectable, Inject } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ConversationRepository } from '@/infrastructure/database/persistence/chat/repositories/conversation.reposiory';
import { MemberRepository } from '@/infrastructure/database/persistence/chat/repositories/member.repository';
import { UserRepository } from '@/infrastructure/database/persistence/user/repositories/user.repository';

export interface CreateConversationInput {
  userId: string;
  otherUserIds: string[];
  groupName?: string;
  groupAvatarUrl?: string;
}

@Injectable()
export class CreateConversationUseCase {
  constructor(
    @Inject('CONVERSATION_REPOSITORY')
    private readonly conversationRepository: ConversationRepository,
    @Inject('MEMBER_REPOSITORY')
    private readonly memberRepository: MemberRepository,
    @Inject('USER_REPOSITORY') private readonly userRepository: UserRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(input: CreateConversationInput): Promise<string> {
    const { userId, otherUserIds } = input;

    if (!userId || !otherUserIds || otherUserIds.length === 0) {
      throw new Error('User ID and other user IDs are required');
    }

    const isExist = await this.userRepository.isExist([
      userId,
      ...otherUserIds,
    ]);

    if (!isExist) {
      throw new Error('One or more users do not exist');
    }

    let createdConversationId: string;
    const type = otherUserIds.length === 1 ? 'direct' : 'group';

    if (type === 'direct') {
      const partnerId = otherUserIds[0];
      const members = await this.memberRepository.findAllByUserId(userId);
      const conversationIds = members.map((member) => member.conversationId);
      const directConversations =
        await this.conversationRepository.findAllByIds(
          conversationIds,
          'direct',
        );

      let isSameDirectConversationExists = false;

      for (const conversation of directConversations) {
        const conversationMembers =
          await this.memberRepository.findByUserIdAndConversationId(
            partnerId,
            conversation.id,
          );
        if (conversationMembers) {
          isSameDirectConversationExists = true;
          break;
        }
      }

      if (isSameDirectConversationExists) {
        throw new Error('Direct conversation already exists');
      }

      const createdConversation = await this.conversationRepository.create({
        type: 'direct',
        name: null,
        avatarUrl: null,
      });

      await this.memberRepository.create({
        conversationId: createdConversation.id,
        userId: userId,
        role: 'member',
      });

      await this.memberRepository.create({
        conversationId: createdConversation.id,
        userId: partnerId,
        role: 'member',
      });

      createdConversationId = createdConversation.id;
    } else {
      const createdConversation = await this.conversationRepository.create({
        type: 'group',
        name: input.groupName || 'New Group',
        avatarUrl: input.groupAvatarUrl || null,
      });

      createdConversationId = createdConversation.id;
    }

    this.eventEmitter.emit('conversation.created', {
      conversationId: createdConversationId,
      userIds: [userId, ...otherUserIds],
    });

    return createdConversationId;
  }
}
