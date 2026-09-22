import {
  Controller,
  Req,
  Get,
  Post,
  Param,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';

import type { AuthenticatedRequest } from '@/common/auth/services/http-auth.service';
import { HttpAuthGuard } from '@/common/auth/guards/http-auth.guard';

import {
  GetConversationsUseCase,
  GetConversationsInput,
} from '@/domains/chat/usecase/get-conversations.usecase';
import {
  GetConversationUseCase,
  GetConversationInput,
} from '@/domains/chat/usecase/get-conversation.usecase';
import {
  GetMessagesUseCase,
  GetMessagesInput,
} from '@/domains/chat/usecase/get-messages.usecase';
import {
  CreateConversationUseCase,
  CreateConversationInput,
} from '@/domains/chat/usecase/create-conversation.usecase';
import {
  SendMessageUseCase,
  SendMessageInput,
} from '@/domains/chat/usecase/send-message.usecase';

@Controller('chat')
export class ChatController {
  constructor(
    private readonly getConversationsUseCase: GetConversationsUseCase,
    private readonly getConversationUseCase: GetConversationUseCase,
    private readonly getMessagesUseCase: GetMessagesUseCase,
    private readonly createDirectConversationUseCase: CreateConversationUseCase,
    private readonly sendDirectMessageUseCase: SendMessageUseCase,
  ) {}

  @UseGuards(HttpAuthGuard)
  @Get('conversations')
  async getConversations(@Req() req: AuthenticatedRequest) {
    const userId = req.user.userId;
    const input: GetConversationsInput = { userId };
    const conversations = await this.getConversationsUseCase.execute(input);
    return {
      message: 'Conversations retrieved successfully',
      data: conversations,
    };
  }

  @UseGuards(HttpAuthGuard)
  @Get('conversations/:conversationId')
  async getConversation(
    @Req() req: AuthenticatedRequest,
    @Param('conversationId') conversationId: string,
  ) {
    const userId = req.user.userId;
    const input: GetConversationInput = { userId, conversationId };
    const conversation = await this.getConversationUseCase.execute(input);
    return {
      message: 'Conversation retrieved successfully',
      data: conversation,
    };
  }

  @UseGuards(HttpAuthGuard)
  @Get('messages/:conversationId')
  async getMessages(
    @Req() req: AuthenticatedRequest,
    @Param('conversationId') conversationId: string,
    @Query('cursor') cursor?: string,
  ) {
    const userId = req.user.userId;
    const input: GetMessagesInput = {
      userId,
      conversationId,
      limit: 10,
      cursor,
    };
    const result = await this.getMessagesUseCase.execute(input);
    return {
      message: 'Messages retrieved successfully',
      ...result,
    };
  }

  @UseGuards(HttpAuthGuard)
  @Post('conversations')
  async createConversation(
    @Req() req: AuthenticatedRequest,
    @Body() body: { otherUserIds: string[] },
  ) {
    const userId = req.user.userId;
    const otherUserIds = body.otherUserIds;

    if (!userId || !otherUserIds || otherUserIds.length === 0) {
      throw new Error('User and other users are required.');
    }

    const input: CreateConversationInput = {
      userId,
      otherUserIds,
    };

    const conversation =
      await this.createDirectConversationUseCase.execute(input);

    return {
      message: 'Conversation created successfully',
      data: conversation,
    };
  }

  @UseGuards(HttpAuthGuard)
  @Post('messages')
  async sendMessage(
    @Req() req: AuthenticatedRequest,
    @Body() body: { conversationId: string; content: string },
  ) {
    const userId = req.user.userId;

    if (!userId) {
      throw new Error('User not authenticated.');
    }

    if (!body.conversationId || !body.content) {
      throw new Error('Conversation and content are required.');
    }

    const input: SendMessageInput = {
      userId: userId,
      conversationId: body.conversationId,
      content: body.content,
    };

    const message = await this.sendDirectMessageUseCase.execute(input);

    return {
      message: 'Message sent successfully',
      data: message,
    };
  }
}
