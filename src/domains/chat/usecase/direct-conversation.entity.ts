import { MessageItem } from '@/domains/chat/usecase/message-item.entity';

export class DirectConversation {
  id!: string;
  partnerId!: string;
  title!: string;
  avatarUrl!: string | null;
  messages!: MessageItem[];
}
