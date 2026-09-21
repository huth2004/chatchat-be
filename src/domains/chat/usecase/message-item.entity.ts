import { Message } from '../entities/message.entity';

export class MessageItem extends Message {
  senderName!: string;
  senderAvatarUrl!: string | null;
}
