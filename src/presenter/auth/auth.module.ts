import { Module, Global } from '@nestjs/common';
import { AuthController } from './auth.controller';

import { JwtAuthService } from '@/common/auth/services/jwt-auth.service';
import { HttpAuthService } from '@/common/auth/services/http-auth.service';
import { WsAuthService } from '@/common/auth/services/ws-auth.service';

import { UserImplRepository } from '@/infrastructure/database/persistence/user/repositories/user-impl.repository';
import { RefreshTokenImplRepository } from '@/infrastructure/database/persistence/auth/repositories/refresh-token-impl.repository';
import { RegisterUseCase } from '@/domains/auth/usecase/register.usecase';
import { LoginUseCase } from '@/domains/auth/usecase/login.usecase';
import { RefreshTokenUseCase } from '@/domains/auth/usecase/refresh-token.usecase';
import { RevokeTokenUseCase } from '@/domains/auth/usecase/revoke-token.usecase';
import { GetAuthUserUseCase } from '@/domains/auth/usecase/get-auth-user.usecase';

@Global()
@Module({
  controllers: [AuthController],
  providers: [
    JwtAuthService,
    HttpAuthService,
    WsAuthService,
    {
      provide: 'USER_REPOSITORY',
      useClass: UserImplRepository,
    },
    {
      provide: 'REFRESH_TOKEN_REPOSITORY',
      useClass: RefreshTokenImplRepository,
    },
    RegisterUseCase,
    LoginUseCase,
    RefreshTokenUseCase,
    RevokeTokenUseCase,
    GetAuthUserUseCase,
  ],
  exports: [JwtAuthService, HttpAuthService, WsAuthService],
})
export class AuthModule {}
