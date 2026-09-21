import { BaseEntity } from '@/domains/base.entity';

export class DirectChat extends BaseEntity {
  conversationId!: string;
  userId1!: string;
  userId2!: string;
}
