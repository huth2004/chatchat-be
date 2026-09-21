import { BaseRepository } from '@/infrastructure/database/persistence/base.repository';
import { DirectChat } from '@/domains/chat/entities/direct-chat.entity';

export abstract class DirectChatRepository extends BaseRepository<DirectChat> {
  abstract findByUserIds(
    userId1: string,
    userId2: string,
  ): Promise<DirectChat | null>;
  abstract findAllByUserId(userId: string): Promise<DirectChat[]>;
  abstract findByUserIdAndConversationId(
    userId: string,
    conversationId: string,
  ): Promise<DirectChat | null>;
}
