import { Module } from '@nestjs/common';
import { UserImplRepository } from '@/infrastructure/database/persistence/user/repositories/user-impl.repository';
import { ConversationImplRepository } from '@/infrastructure/database/persistence/chat/repositories/conversation-impl.repository';
import { DirectChatImplRepository } from '@/infrastructure/database/persistence/chat/repositories/direct-chat-impl.repository';
import { MessageImplRepository } from '@/infrastructure/database/persistence/chat/repositories/message-impl.repository';
import { ChatController } from './chat.controller';
import { GetConversationsUseCase } from '@/domains/chat/usecase/get-conversations.usecase';
import { GetConversationUseCase } from '@/domains/chat/usecase/get-conversation.usecase';
import { GetDirectConversationUseCase } from '@/domains/chat/usecase/get-direct-conversation.usecase';
import { CreateDirectConversationUseCase } from '@/domains/chat/usecase/create-direct-conversation.usecase';
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
      provide: 'DIRECT_CHAT_REPOSITORY',
      useClass: DirectChatImplRepository,
    },
    {
      provide: 'MESSAGE_REPOSITORY',
      useClass: MessageImplRepository,
    },
    GetConversationsUseCase,
    GetConversationUseCase,
    GetDirectConversationUseCase,
    CreateDirectConversationUseCase,
    SendMessageUseCase,
    ChatGateway,
  ],
})
export class ChatModule {}
