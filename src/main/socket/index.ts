import { Server, socketio } from 'socket.io';
import http from 'http';

interface ISocket {
  init: (server: http.Server) => void;
}

const socketio = new Server();

const sockets: ISocket = {
  init: (server: http.Server) => {
    const io = socketio.listen(server);
    io.sockets.on('connection', (socket) => {
      console.log('socket connected');
      socket.on('message', (_data) => {});
    });
  },
};

export default sockets;
