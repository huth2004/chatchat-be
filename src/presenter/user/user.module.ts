import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserImplRepository } from '@/infrastructure/database/persistence/user/repositories/user-impl.repository';
import { GetProfileUseCase } from '@/domains/user/usecase/get-profile.usecase';
import { SearchProfilesUseCase } from '@/domains/user/usecase/search-profiles.usecase';

@Module({
  controllers: [UserController],
  providers: [
    { provide: 'USER_REPOSITORY', useClass: UserImplRepository },
    GetProfileUseCase,
    SearchProfilesUseCase,
  ],
})
export class UserModule {}
