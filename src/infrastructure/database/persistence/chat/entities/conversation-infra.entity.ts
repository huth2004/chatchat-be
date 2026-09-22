import { BaseInfraEntity } from '../../base-infra.entity';

export class ConversationInfrastructure extends BaseInfraEntity {
  type!: 'direct' | 'group';
  name!: string | null;
  avartarUrl!: string | null;
}
