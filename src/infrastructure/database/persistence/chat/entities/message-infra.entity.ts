import { BaseInfraEntity } from '@/infrastructure/database/persistence/base-infra.entity';

export class MessageInfrastructure extends BaseInfraEntity {
  conversationId!: string;
  senderId!: string;
  content!: string;
}
