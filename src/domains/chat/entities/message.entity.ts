import { BaseEntity } from '@/domains/base.entity';

export class Message extends BaseEntity {
  conversationId!: string;
  senderId!: string;
  content!: string;
}
