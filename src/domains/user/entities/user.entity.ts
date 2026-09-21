import { BaseEntity } from '@/domains/base.entity';

export class User extends BaseEntity {
  username!: string;
  password!: string;
  role!: 'user' | 'admin';
}
