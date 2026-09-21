import { BaseEntity } from '@/domains/base.entity';

export class Conversation extends BaseEntity {
  type!: 'direct' | 'group';
}
