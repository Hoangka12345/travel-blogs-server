import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { GatewayService } from './gateway.service';
import { Server, Socket } from 'socket.io'

@WebSocketGateway()
export class GatewayGateway {
  @WebSocketServer()
  server: Server

  constructor(private readonly gatewayService: GatewayService) { }

  @SubscribeMessage('connection')
  handleConnection(
    @ConnectedSocket() socket: Socket,
    @MessageBody() userId: string
  ) {
    if (userId) {
      this.gatewayService.setUserSocket(userId, socket.id);
    }
  }

  handleDisconnect(userId: string) {
    this.gatewayService.removeUserSocket(userId)
  }

  handleComment(@MessageBody() comment: any) {
    if (this.server) {
      this.server.emit('comment', comment);
    } else {
      console.log("Không thể gửi comment, server chưa được khởi tạo.");
    }
  }

  handleReaction(@MessageBody() totalReactions: number) {
    if (this.server) {
      this.server.emit('reaction', totalReactions);
    } else {
      console.log("Không thể gửi reaction, server chưa được khởi tạo.");
    }
  }

  handleNotification(@MessageBody() data: { userId: string, notifications: Notification[] }) {
    const { userId, notifications } = data

    const useSocketId = this.gatewayService.getUserSocket(String(userId))
    if (useSocketId) {
      if (this.server) {
        this.server.to(useSocketId).emit('notification', notifications);
      } else {
        console.log("Không thể gửi notification, server chưa được khởi tạo.");
      }
    }
  }
}
