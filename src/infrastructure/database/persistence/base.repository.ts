export abstract class BaseRepository<T> {
  abstract findAll(): Promise<T[]>;
  abstract findById(id: string): Promise<T | null>;
  abstract create(
    entity: Omit<
      T,
      'id' | 'createdAt' | 'updatedAt' | 'isDeleted' | 'deletedAt'
    >,
  ): Promise<T>;
  abstract update(
    id: string,
    entity: Partial<
      Omit<T, 'id' | 'createdAt' | 'updatedAt' | 'isDeleted' | 'deletedAt'>
    >,
  ): Promise<T | null>;
  abstract delete(id: string): Promise<boolean>;
}
