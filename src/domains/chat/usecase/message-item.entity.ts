import { Message } from '../entities/message.entity';

export class MessageItem extends Message {
  senderUsername!: string;
  senderAvatarUrl!: string | null;
}
