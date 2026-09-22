import { Injectable, Inject } from '@nestjs/common';
import { UserRepository } from '@/infrastructure/database/persistence/user/repositories/user.repository';
import { Profile } from './profile.entity';

interface GetProfileInput {
  username: string;
}

@Injectable()
export class GetProfileUseCase {
  constructor(
    @Inject('USER_REPOSITORY') private readonly userRepository: UserRepository,
  ) {}

  async execute(input: GetProfileInput): Promise<Profile> {
    const { username } = input;

    const user = await this.userRepository.findByUsername(username);

    if (!user) {
      throw new Error('User not found.');
    }

    return {
      id: user.id,
      username: user.username,
      avatarUrl: user.avatarUrl,
    };
  }
}
