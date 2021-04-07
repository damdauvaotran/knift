import { Socket } from 'socket.io';

export default (socket: Socket) => {
  return socket.on('message', (data) => {
    console.log(data);
  });
};
