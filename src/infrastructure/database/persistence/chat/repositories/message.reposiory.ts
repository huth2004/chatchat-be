import { BaseRepository } from '@/infrastructure/database/persistence/base.repository';
import { Message } from '@/domains/chat/entities/message.entity';
export abstract class MessageRepository extends BaseRepository<Message> {
  abstract findLastByConversationId(
    conversationId: string,
  ): Promise<Message | null>;
  abstract findAllByConversationId(conversationId: string): Promise<Message[]>;
}
