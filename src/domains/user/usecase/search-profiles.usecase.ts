import { Injectable, Inject } from '@nestjs/common';
import { UserRepository } from '@/infrastructure/database/persistence/user/repositories/user.repository';
import { User } from '@/domains/user/entities/user.entity';
import { Profile } from './profile.entity';

interface SearchProfilesInput {
  query: string;
}

@Injectable()
export class SearchProfilesUseCase {
  constructor(
    @Inject('USER_REPOSITORY') private readonly userRepository: UserRepository,
  ) {}

  async execute(input: SearchProfilesInput): Promise<Profile[]> {
    const { query } = input;

    const users: User[] = await this.userRepository.searchByUsername(query);

    return users.map((user): Profile => ({
      id: user.id,
      username: user.username,
      avatarUrl: user.avatarUrl,
    }));
  }
}
