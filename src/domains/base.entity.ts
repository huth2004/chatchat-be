export abstract class BaseEntity {
  id!: string;
  createdAt!: Date;
  updatedAt!: Date | null;
  isDeleted!: boolean;
  deletedAt!: Date | null;
}
