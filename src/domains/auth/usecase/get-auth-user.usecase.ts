import { Injectable, Inject } from '@nestjs/common';
import { UserRepository } from '@/infrastructure/database/persistence/user/repositories/user.repository';
import { AuthUser } from './auth-user.entiy';

export interface GetAuthUserInput {
  userId: string;
}

@Injectable()
export class GetAuthUserUseCase {
  constructor(
    @Inject('USER_REPOSITORY') private readonly userRepository: UserRepository,
  ) {}
  async execute(input: GetAuthUserInput): Promise<AuthUser> {
    const { userId } = input;

    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    return {
      id: user.id,
      username: user.username,
      avatarUrl: user.avatarUrl,
      role: user.role,
    };
  }
}
