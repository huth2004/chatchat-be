import { Controller, Get, Param, UseGuards } from '@nestjs/common';

import { HttpAuthGuard } from '@/common/auth/guards/http-auth.guard';
import { GetProfileUseCase } from '@/domains/user/usecase/get-profile.usecase';
import { SearchProfilesUseCase } from '@/domains/user/usecase/search-profiles.usecase';
import { Profile } from '@/domains/user/usecase/profile.entity';

@Controller('users')
export class UserController {
  constructor(
    private readonly getProfileUseCase: GetProfileUseCase,
    private readonly searchProfilesUseCase: SearchProfilesUseCase,
  ) {}

  @UseGuards(HttpAuthGuard)
  @Get(':username')
  async getProfile(@Param('username') username: string) {
    try {
      const profile: Profile = await this.getProfileUseCase.execute({
        username,
      });
      return { message: 'Profile retrieved successfully', data: profile };
    } catch (error) {
      throw new Error('Failed to retrieve profile', { cause: error });
    }
  }

  @UseGuards(HttpAuthGuard)
  @Get(`search/:query`)
  async searchProfiles(@Param('query') query: string) {
    try {
      const profiles: Profile[] = await this.searchProfilesUseCase.execute({
        query,
      });
      return { message: 'Profiles retrieved successfully', data: profiles };
    } catch (error) {
      throw new Error('Failed to search profiles', { cause: error });
    }
  }
}
