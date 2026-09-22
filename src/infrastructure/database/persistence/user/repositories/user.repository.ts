import { User } from '@/domains/user/entities/user.entity';
import { BaseRepository } from '@/infrastructure/database/persistence/base.repository';

export abstract class UserRepository extends BaseRepository<User> {
  abstract findByUsername(username: string): Promise<User | null>;
  abstract searchByUsername(query: string): Promise<User[]>;
  abstract isExist(userIds: string[]): Promise<boolean>;
}
