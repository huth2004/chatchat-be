import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { UserImplRepository } from '@/infrastructure/database/persistence/user/repositories/user-impl.repository';
import { ConversationImplRepository } from '@/infrastructure/database/persistence/chat/repositories/conversation-impl.repository';
import { MemberImplRepository } from '@/infrastructure/database/persistence/chat/repositories/member-impl.repository';
import { MessageImplRepository } from '@/infrastructure/database/persistence/chat/repositories/message-impl.repository';
import { GetConversationsUseCase } from '@/domains/chat/usecase/get-conversations.usecase';
import { GetConversationUseCase } from '@/domains/chat/usecase/get-conversation.usecase';
import { GetMessagesUseCase } from '@/domains/chat/usecase/get-messages.usecase';
import { CreateConversationUseCase } from '@/domains/chat/usecase/create-conversation.usecase';
import { SendMessageUseCase } from '@/domains/chat/usecase/send-message.usecase';
import { ChatGateway } from './chat.gateway';

@Module({
  controllers: [ChatController],
  providers: [
    {
      provide: 'USER_REPOSITORY',
      useClass: UserImplRepository,
    },
    {
      provide: 'CONVERSATION_REPOSITORY',
      useClass: ConversationImplRepository,
    },
    {
      provide: 'MEMBER_REPOSITORY',
      useClass: MemberImplRepository,
    },
    {
      provide: 'MESSAGE_REPOSITORY',
      useClass: MessageImplRepository,
    },
    GetConversationsUseCase,
    GetConversationUseCase,
    GetMessagesUseCase,
    CreateConversationUseCase,
    SendMessageUseCase,
    ChatGateway,
  ],
})
export class ChatModule {}
