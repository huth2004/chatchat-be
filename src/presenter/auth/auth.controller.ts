import {
  Controller,
  Req,
  Res,
  Get,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { HttpAuthGuard } from '@/common/auth/guards/http-auth.guard';
import type { AuthenticatedRequest } from '@/common/auth/services/http-auth.service';
import { ConfigService } from '@nestjs/config';

import { RegisterUseCase } from '@/domains/auth/usecase/register.usecase';
import { RegisterInput } from '@/domains/auth/usecase/register.usecase';
import { LoginUseCase } from '@/domains/auth/usecase/login.usecase';
import { LoginInput } from '@/domains/auth/usecase/login.usecase';
import { AuthToken } from '@/domains/auth/usecase/auth-token.entity';
import { AuthUser } from '@/domains/auth/usecase/auth-user.entiy';
import {
  RefreshTokenUseCase,
  RefreshTokenInput,
} from '@/domains/auth/usecase/refresh-token.usecase';
import {
  RevokeTokenUseCase,
  RevokeTokenInput,
} from '@/domains/auth/usecase/revoke-token.usecase';
import {
  GetAuthUserUseCase,
  GetAuthUserInput,
} from '@/domains/auth/usecase/get-auth-user.usecase';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly configService: ConfigService,
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly revokeTokenUseCase: RevokeTokenUseCase,
    private readonly getAuthUserUseCase: GetAuthUserUseCase,
  ) {}

  @Post('register')
  async register(
    @Body() body: { username: string; password: string; acceptTerms: boolean },
  ) {
    const registerInput: RegisterInput = {
      username: body.username,
      password: body.password,
      acceptTerms: body.acceptTerms,
    };
    try {
      const userId: string = await this.registerUseCase.execute(registerInput);
      return {
        message: 'Registration successful',
        data: {
          userId,
        },
      };
    } catch (error) {
      throw new Error('Failed to register: ', { cause: error });
    }
  }

  @Post('login')
  async login(
    @Body() body: { username: string; password: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const loginInput: LoginInput = {
      username: body.username,
      password: body.password,
    };
    try {
      const authToken: AuthToken = await this.loginUseCase.execute(loginInput);
      if (!authToken) {
        throw new Error('Invalid username or password.');
      }
      console.log('AuthToken:', authToken);
      res.cookie('refresh_token', authToken.refreshToken, {
        httpOnly: true,
        secure: this.configService.get<string>('NODE_ENV') === 'production',
        sameSite: 'strict',
        expires: authToken.expiresAt,
      });
      return {
        status: 'success',
        message: 'Login successful',
        data: {
          accessToken: authToken.accessToken,
        },
      };
    } catch (error) {
      throw new Error('Failed to login: ', { cause: error });
    }
  }

  @Post('refresh')
  async refresh(
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ) {
    const cookies = req.cookies;
    try {
      const refreshToken: unknown = cookies?.refresh_token;
      if (!refreshToken) {
        throw new Error('Refresh token not found.');
      }
      const refreshTokenInput: RefreshTokenInput = {
        token: refreshToken as string,
      };
      const authToken: AuthToken =
        await this.refreshTokenUseCase.execute(refreshTokenInput);
      if (!authToken) {
        throw new Error('Failed to refresh token.');
      }
      res.cookie('refresh_token', authToken.refreshToken, {
        httpOnly: true,
        secure: this.configService.get<string>('NODE_ENV') === 'production',
        sameSite: 'strict',
        expires: authToken.expiresAt,
      });
      return {
        status: 'success',
        message: 'Token refreshed successfully',
        data: {
          accessToken: authToken.accessToken,
        },
      };
    } catch (error) {
      throw new Error('Failed to refresh token: ', { cause: error });
    }
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response, @Req() req: Request) {
    const cookies = req.cookies;

    try {
      const revokeTokenInput: RevokeTokenInput = {
        token: cookies?.refresh_token as string,
      };
      await this.revokeTokenUseCase.execute(revokeTokenInput);
      res.clearCookie('access_token', {
        httpOnly: true,
        secure: this.configService.get<string>('NODE_ENV') === 'production',
        sameSite: 'strict',
      });
      res.clearCookie('refresh_token', {
        httpOnly: true,
        secure: this.configService.get<string>('NODE_ENV') === 'production',
        sameSite: 'strict',
      });
      return { message: 'Logout successful' };
    } catch (error) {
      throw new Error('Failed to logout: ', { cause: error });
    }
  }

  @UseGuards(HttpAuthGuard)
  @Get('me')
  async getMe(@Req() req: AuthenticatedRequest) {
    const userId = req.user.userId;
    const getAuthUserInput: GetAuthUserInput = {
      userId,
    };

    const user: AuthUser =
      await this.getAuthUserUseCase.execute(getAuthUserInput);

    if (!user) {
      throw new Error('User not found.');
    }

    return {
      message: 'User retrieved successfully',
      data: {
        user,
      },
    };
  }
}
