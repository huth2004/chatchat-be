import { BaseInfraEntity } from '../../base-infra.entity';

export class MemberInfrastructure extends BaseInfraEntity {
  conversationId!: string;
  userId!: string;
  role!: 'leader' | 'member';
}
