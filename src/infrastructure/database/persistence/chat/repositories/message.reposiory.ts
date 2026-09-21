import { BaseRepository } from '@/infrastructure/database/persistence/base.repository';
import { Message } from '@/domains/chat/entities/message.entity';
export abstract class MessageRepository extends BaseRepository<Message> {
  abstract findLastMessageByConversationId(
    conversationId: string,
  ): Promise<Message | null>;
  abstract findAllMessagesByConversationId(
    conversationId: string,
  ): Promise<Message[]>;
}
