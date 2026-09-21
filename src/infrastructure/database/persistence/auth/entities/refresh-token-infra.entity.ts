import { BaseInfraEntity } from '../../base-infra.entity';

export class RefreshTokenInfrastructure extends BaseInfraEntity {
  userId!: string;
  token!: string;
  isRevoked!: boolean;
  expiresAt!: Date;
}
