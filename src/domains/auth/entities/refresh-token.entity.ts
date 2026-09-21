import { BaseEntity } from '@/domains/base.entity';

export class RefreshToken extends BaseEntity {
  userId!: string;
  token!: string;
  isRevoked!: boolean;
  expiresAt!: Date;
}
