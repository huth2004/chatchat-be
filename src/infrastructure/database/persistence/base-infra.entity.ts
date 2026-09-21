export abstract class BaseInfraEntity {
  id!: string;
  createdAt!: Date;
  updatedAt!: Date | null;
  isDeleted!: boolean;
  deletedAt!: Date | null;
}
