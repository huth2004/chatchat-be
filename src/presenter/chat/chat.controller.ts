import {
  Controller,
  Req,
  Get,
  Post,
  Param,
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
  GetDirectConversationUseCase,
  GetDirectConversationInput,
} from '@/domains/chat/usecase/get-direct-conversation.usecase';
import {
  CreateDirectConversationUseCase,
  CreateDirectConversationInput,
} from '@/domains/chat/usecase/create-direct-conversation.usecase';
import {
  SendMessageUseCase,
  SendMessageInput,
} from '@/domains/chat/usecase/send-message.usecase';

@Controller('chat')
export class ChatController {
  constructor(
    private readonly getConversationsUseCase: GetConversationsUseCase,
    private readonly getConversationUseCase: GetConversationUseCase,
    private readonly getDirectConversationUseCase: GetDirectConversationUseCase,
    private readonly createDirectConversationUseCase: CreateDirectConversationUseCase,
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
  @Get('conversations/direct/:conversationId')
  async getDirectConversation(
    @Req() req: AuthenticatedRequest,
    @Param('conversationId') conversationId: string,
  ) {
    const userId = req.user.userId;
    const input: GetDirectConversationInput = {
      userId,
      conversationId,
    };
    const conversation = await this.getDirectConversationUseCase.execute(input);
    return {
      message: 'Direct conversation retrieved successfully',
      data: conversation,
    };
  }

  @UseGuards(HttpAuthGuard)
  @Post('conversations/direct')
  async createDirectConversation(
    @Req() req: AuthenticatedRequest,
    @Body() body: { partnerId: string },
  ) {
    const userId = req.user.userId;
    const partnerId = body.partnerId;

    if (!userId || !partnerId) {
      throw new Error('User and partner are required.');
    }

    const input: CreateDirectConversationInput = {
      userId,
      partnerId,
    };

    const conversation =
      await this.createDirectConversationUseCase.execute(input);

    return {
      message: 'Direct conversation created successfully',
      data: conversation,
    };
  }

  @UseGuards(HttpAuthGuard)
  @Post('conversations')
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
