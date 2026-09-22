import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Logger, UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { OnEvent } from '@nestjs/event-emitter';

import {
  WsAuthService,
  type AuthenticatedSocket,
} from '@/common/auth/services/ws-auth.service';
import { WsAuthGuard } from '@/common/auth/guards/ws-auth.guard';

import { GetConversationUseCase } from '@/domains/chat/usecase/get-conversation.usecase';

@WebSocketGateway({
  namespace: '/chat',
  cors: {
    origin: ['http://localhost:3000'],
    credentials: true,
  },
  transports: ['websocket'],
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(ChatGateway.name);

  constructor(
    private readonly wsAuthService: WsAuthService,
    private readonly getConversationUseCase: GetConversationUseCase,
  ) {}

  async handleConnection(client: Socket) {
    try {
      await this.wsAuthService.authenticate(client);

      const authenticatedSocket = client as AuthenticatedSocket;
      const userId = authenticatedSocket.user.userId;

      // Join a unique room for the user
      const userRoomId = this.getUserRoom(userId);
      await client.join(userRoomId);

      this.logger.log(`Socket connected: ${client.id}, room: ${userRoomId}`);
    } catch (error) {
      console.error('Socket connection rejected:', error);
      this.logger.warn(`Rejected socket connection: ${client.id}`);
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Socket disconnected: ${client.id}`);
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('conversation:join')
  async joinConversation(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() body: { conversationId: string },
  ) {
    const userId = client.user.userId;
    const conversationId = body?.conversationId;

    if (!userId || !conversationId) {
      return { ok: false, message: 'Invalid request' };
    }

    try {
      await this.getConversationUseCase.execute({
        userId,
        conversationId,
      });
    } catch (error) {
      console.error('Error in joinConversation:', error);
      return {
        ok: false,
        message: 'Bạn không có quyền truy cập cuộc trò chuyện này',
      };
    }

    const conversationRoomId = this.getConversationRoom(conversationId);

    await client.join(conversationRoomId);

    this.logger.log(
      `User ${userId} joined conversation ${conversationId}, room: ${conversationRoomId}`,
    );

    return {
      ok: true,
      conversationId: body.conversationId,
    };
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('conversation:leave')
  async leaveConversation(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() body: { conversationId: string },
  ) {
    const userId = client.user?.userId;
    const conversationId = body?.conversationId;

    if (!userId) {
      return { ok: false, message: 'Invalid user' };
    }

    if (!conversationId) {
      return { ok: false, message: 'Invalid conversationId' };
    }

    const conversationRoomId = this.getConversationRoom(conversationId);

    await client.leave(conversationRoomId);

    this.logger.log(
      `User ${userId} left conversation ${conversationId}, room: ${conversationRoomId}`,
    );

    return {
      ok: true,
      conversationId: body.conversationId,
    };
  }

  @OnEvent('conversation.created')
  handleConversationCreatedEvent(payload: {
    conversationId: string;
    userIds: string[];
  }) {
    const { conversationId, userIds } = payload;

    userIds.forEach((userId) => {
      const userRoomId = this.getUserRoom(userId);
      this.server.to(userRoomId).emit('conversation:new', { conversationId });
    });
  }

  @OnEvent('message.created')
  handleMessageCreatedEvent(payload: {
    conversationId: string;
    [key: string]: unknown;
  }) {
    this.server
      .to(this.getConversationRoom(payload.conversationId))
      .emit('message:new', payload);
  }

  private getUserRoom(userId: string) {
    return `user:${userId}`;
  }

  private getConversationRoom(conversationId: string) {
    return `conversation:${conversationId}`;
  }
}
