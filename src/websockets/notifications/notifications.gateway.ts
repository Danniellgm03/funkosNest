import * as process from 'process'
import { Server, Socket } from 'socket.io'
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Logger } from '@nestjs/common'
import { ResponseFunkoDto } from '../../rest/funkos/dto/response-funko.dto'
import { Notification } from './models/notification.model'
import { Category } from '../../rest/categories/entities/category.entity'

const ENDPOINT: string = `/ws/${process.env.API_VERSION || 'v1'}/funkos`

@WebSocketGateway({ namespace: ENDPOINT })
export class NotificationsGateway {
  @WebSocketServer()
  private server: Server

  private readonly logger: Logger = new Logger(NotificationsGateway.name)

  constructor() {
    this.logger.log(`WebSocketGateway conectado en ${ENDPOINT}`)
  }

  sendMessage(notification: Notification<ResponseFunkoDto | Category>) {
    this.server.emit('updates', notification)
  }

  private handleConnection(client: Socket) {
    this.logger.log(`Cliente conectado: ${client.id}`)
    this.server.emit('connection', 'NOTIFICACIONES CONECTADAS')
  }

  private handleDisconnect(client: Socket) {
    this.logger.log(`Cliente desconectado: ${client.id}`)
  }
}
