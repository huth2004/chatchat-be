import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '@/presenter/auth/auth.module';
import { UserModule } from '@/presenter/user/user.module';
import { ChatModule } from '@/presenter/chat/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: '.env',
    }),
    JwtModule.registerAsync({
      global: true,
      useFactory: () => ({
        secret: 'JWT_MODULE_SECRET',
        signOptions: {
          expiresIn: 60000,
        },
      }),
    }),
    EventEmitterModule.forRoot(),
    AuthModule,
    UserModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
