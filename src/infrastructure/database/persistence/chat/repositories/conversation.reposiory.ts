import { BaseRepository } from '@/infrastructure/database/persistence/base.repository';
import { Conversation } from '@/domains/chat/entities/conversation.entity';

export abstract class ConversationRepository extends BaseRepository<Conversation> {}
