import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io'

@WebSocketGateway({cors: true})
export class MyGateway implements OnGatewayConnection, OnGatewayDisconnect{

    @WebSocketServer()
    server: Server
    private clients: any = {}

    handleConnection() {
        this.server.on('connection', (socket) => {
            console.log('connected', socket.id)
        })
    }

    handleDisconnect(client: Socket) {
        console.log('disconnected', client.id)
        delete this.clients[client.id]
    }

    @SubscribeMessage('newMessage')
    onNewMessage(@MessageBody() body: any){
        this.server.emit('onMessage', body)
    }

    @SubscribeMessage('mouseCoordinate')
    onMouseMove(@MessageBody() body: any, @ConnectedSocket() client: Socket){
        if(!this.clients[client.id]){
            this.clients[client.id] = {
                x: body.x,
                y: body.y
            }
        }
        this.clients[client.id].x = body.x
        this.clients[client.id].y = body.y
        this.server.emit('onMouseMove', this.clients)
    }
}