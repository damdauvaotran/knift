import { Server, Socket } from 'socket.io';
import http from 'http';
import helloWorldSocket from './helloword'

interface ISocket {
  init: (server: http.Server) => void;
}

const socketio = new Server();

const sockets: ISocket = {
  init: (server: http.Server) => {
    const io = socketio.listen(server);
    io.sockets.on('connection', (socket: Socket) => {
      console.log('socket connected');
      socket.on('message', (_data) => {});
      helloWorldSocket(socket)
    });
  },
};

export default sockets;
