import { BaseInfraEntity } from '../../base-infra.entity';

export class DirectChatInfrastructure extends BaseInfraEntity {
  conversationId!: string;
  userId1!: string;
  userId2!: string;
}
