import { Conversation } from '../entities/conversation.entity';
import { LastMessage } from './last-message.entity';

export class ConversationItem extends Conversation {
  title!: string;
  lastMessage!: LastMessage | null;
}
