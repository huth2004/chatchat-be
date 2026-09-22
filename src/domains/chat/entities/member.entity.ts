import { BaseEntity } from '@/domains/base.entity';

export class Member extends BaseEntity {
  conversationId!: string;
  userId!: string;
  role!: 'leader' | 'member';
}
