import { Conversation } from '../entities/conversation.entity';
import { LastMessage } from './last-message.entity';

export class ConversationItem extends Conversation {
  title!: string;
  avatarUrl!: string | null;
  lastMessage!: LastMessage | null;
}
