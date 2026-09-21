import { BaseInfraEntity } from '../../base-infra.entity';

export class UserInfrastructure extends BaseInfraEntity {
  username!: string;
  password!: string;
  role!: 'user' | 'admin';
}
