import { Injectable, Inject } from '@nestjs/common';
import { UserRepository } from '@/infrastructure/database/persistence/user/repositories/user.repository';

import bcrypt from 'bcrypt-ts';

export interface RegisterInput {
  username: string;
  password: string;
  acceptTerms: boolean;
}

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject('USER_REPOSITORY') private readonly userRepository: UserRepository,
  ) {}

  async execute(input: RegisterInput): Promise<string> {
    const { username, password, acceptTerms } = input;

    if (!username || !password) {
      throw new Error('Username and password are required.');
    }

    if (username.length < 3 || username.length > 20) {
      throw new Error('Username must be between 3 and 20 characters.');
    }

    if (password.length < 6 || password.length > 50) {
      throw new Error('Password must be between 6 and 50 characters.');
    }

    if (!acceptTerms) {
      throw new Error('You must accept the terms and conditions.');
    }

    const existingUser = await this.userRepository.findByUsername(username);

    if (existingUser) {
      throw new Error('Username already exists.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.userRepository.create({
      username,
      password: hashedPassword,
      role: 'user',
    });

    return newUser.id;
  }
}
