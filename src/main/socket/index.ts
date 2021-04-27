import { Server, Socket } from 'socket.io';
import http from 'http';
import { getUserInfoByToken } from '../utils/request';
import { Room } from './Room';
import { Peer } from './Peer';
import config from './config';
import {addAttendance} from '../services/attendance_service'
import * as mediasoup from 'mediasoup';
import { json } from 'sequelize/types';

interface ISocket {
  init: (server: http.Server) => void;
}

const socketio = new Server({
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

let roomList = new Map();

const sockets: ISocket = {
  init: (server: http.Server) => {
    const io: Server = socketio.listen(server);
    io.sockets.on('connection', async (socket: Socket | any) => {
      socket.auth = false;
      socket.on('stream', (data: any) => {
        console.log(data);
        socket.emit('receive-stream', data);
      });
      socket.on('authen', async (token: any) => {
        try {
          const userInfo = await getUserInfoByToken(token);
          console.log('Authenticated socket ', socket.id);
          socket.auth = true;
          socket.role = userInfo.role;
          socket.userId = userInfo.id;
        } catch (e) {
          socket.disconnect('unauthorized');
        }
      });

      setTimeout(() => {
        if (!socket.auth) {
          console.log('Disconnecting socket ', socket.id);
          socket.disconnect('unauthorized');
        }
      }, 1000);

      socket.on(
        'createRoom',
        async ({ roomId }: { roomId: string }, callback: Function) => {
          if (roomList.has(roomId)) {
            callback('already exists');
          } else {
            console.log('---created room--- ', roomId);
            let worker = await getMediasoupWorker();
            roomList.set(roomId, new Room(roomId, worker, io));
            callback(roomId);
          }
        }
      );

      socket.on(
        'join',
        ({ roomId, name }: { roomId: string; name: string }, cb: Function) => {
          console.log('---user joined--- "' + roomId + '": ' + name);
          if (!roomList.has(roomId)) {
            return cb({
              error: 'room does not exist',
            });
          }

          addAttendance(socket.userId, parseInt(roomId, 10)).then(data=>{
            console.log('--- insert attendance -- ' + JSON.stringify(data))
          })
          roomList.get(roomId).addPeer(new Peer(socket.id, name));
          socket.roomId = roomId;

          cb(roomList.get(roomId).toJson());
        }
      );

      socket.on('getProducers', () => {
        console.log(
          `---get producers--- name:${
            roomList.get(socket.roomId).getPeers().get(socket.id).name
          }`
        );
        // send all the current producer to newly joined member
        if (!roomList.has(socket.roomId)) return;
        let producerList = roomList
          .get(socket.roomId)
          .getProducerListForPeer(socket.id);

        socket.emit('newProducers', producerList);
        console.log(`---return producers---:${producerList}`);
      });

      socket.on('getRouterRtpCapabilities', (_: any, callback: Function) => {
        console.log(
          `---get RouterRtpCapabilities--- name: ${
            roomList.get(socket.roomId).getPeers().get(socket.id).name
          }`
        );
        try {
          callback(roomList.get(socket.roomId).getRtpCapabilities());
        } catch (e) {
          callback({
            error: e.message,
          });
        }
      });

      socket.on('createWebRtcTransport', async (_: any, callback: Function) => {
        console.log(
          `---create webrtc transport--- name: ${
            roomList.get(socket.roomId).getPeers().get(socket.id).name
          }`
        );
        try {
          const { params } = await roomList
            .get(socket.roomId)
            .createWebRtcTransport(socket.id);

          callback(params);
        } catch (err) {
          console.error(err);
          callback({
            error: err.message,
          });
        }
      });

      socket.on(
        'connectTransport',
        async (
          {
            transportId,
            dtlsParameters,
          }: { transportId: string; dtlsParameters: any },
          callback: Function
        ) => {
          console.log(
            `---connect transport--- name: ${
              roomList.get(socket.roomId).getPeers().get(socket.id).name
            }`
          );
          if (!roomList.has(socket.roomId)) return;
          await roomList
            .get(socket.roomId)
            .connectPeerTransport(socket.id, transportId, dtlsParameters);

          callback('success');
        }
      );

      socket.on(
        'produce',
        async (
          {
            kind,
            rtpParameters,
            producerTransportId,
          }: { kind: string; rtpParameters: any; producerTransportId: string },
          callback: Function
        ) => {
          if (!roomList.has(socket.roomId)) {
            return callback({ error: 'not is a room' });
          }

          let producerId = await roomList
            .get(socket.roomId)
            .produce(socket.id, producerTransportId, rtpParameters, kind);
          console.log(
            `---produce--- type: ${kind} name: ${
              roomList.get(socket.roomId).getPeers().get(socket.id).name
            } id: ${producerId}`
          );
          callback({
            producerId,
          });
        }
      );

      socket.on(
        'consume',
        async (
          { consumerTransportId, producerId, rtpCapabilities }: any,
          callback: Function
        ) => {
          console.log('consume info', producerId);
          //TODO null handling
          let params = await roomList
            .get(socket.roomId)
            .consume(
              socket.id,
              consumerTransportId,
              producerId,
              rtpCapabilities
            );

          console.log(
            `---consuming--- name: ${
              roomList.get(socket.roomId) &&
              roomList.get(socket.roomId).getPeers().get(socket.id).name
            } prod_id:${producerId} consumer_id:${Object.keys(params)}`
          );
          callback(params);
        }
      );

      // socket.on('resume', async (data: any, callback: Function) => {
      //   await consumer.resume();
      //   callback();
      // });

      socket.on('getMyRoomInfo', (_: any, cb: Function) => {
        cb(roomList.get(socket.roomId).toJson());
      });

      socket.on('disconnect', () => {
        console.log(
          `---disconnect--- name: ${
            roomList.get(socket.roomId) &&
            roomList.get(socket.roomId).getPeers().get(socket.id).name
          }`
        );
        if (!socket.roomId) return;
        roomList.get(socket.roomId).removePeer(socket.id);
      });

      socket.on('producerClosed', ({ producerId }: { producerId: string }) => {
        console.log(
          `---producer close--- name: ${
            roomList.get(socket.roomId) &&
            roomList.get(socket.roomId).getPeers().get(socket.id).name
          }`
        );
        roomList.get(socket.roomId).closeProducer(socket.id, producerId);
      });

      socket.on('exitRoom', async (_: any, callback: Function) => {
        console.log('socket', socket);
        console.log(
          `---exit room--- name: ${
            roomList.get(socket.roomId) &&
            roomList.get(socket.roomId).getPeers().get(socket.id).name
          }`
        );
        if (!roomList.has(socket.roomId)) {
          callback({
            error: 'not currently in a room',
          });
          return;
        }
        // close transports
        await roomList.get(socket.roomId).removePeer(socket.id);
        if (roomList.get(socket.roomId).getPeers().size === 0) {
          roomList.delete(socket.roomId);
        }

        socket.roomId = null;

        callback('successfully exited room');
      });
    });
  },
};

let workers: any[] = [];
let nextMediasoupWorkerIdx = 0;

function getMediasoupWorker() {
  const worker = workers[nextMediasoupWorkerIdx];

  if (++nextMediasoupWorkerIdx === workers.length) nextMediasoupWorkerIdx = 0;

  return worker;
}

(async () => {
  console.log('Creating media soup worker');
  await createWorkers();
  console.log(`Created ${workers.length} mediasoup worker`);
})();

async function createWorkers() {
  let { numWorkers } = config.mediasoup;

  for (let i = 0; i < numWorkers; i++) {
    let worker = await mediasoup.createWorker({
      logLevel: config.mediasoup.worker
        .logLevel as mediasoup.types.WorkerLogLevel,
      logTags: config.mediasoup.worker
        .logTags as mediasoup.types.WorkerLogTag[],
      rtcMinPort: config.mediasoup.worker.rtcMinPort,
      rtcMaxPort: config.mediasoup.worker.rtcMaxPort,
    });

    worker.on('died', () => {
      console.error(
        'mediasoup worker died, exiting in 2 seconds... [pid:%d]',
        worker.pid
      );
      setTimeout(() => process.exit(1), 2000);
    });
    workers.push(worker);

    // log worker resource usage
    /*setInterval(async () => {
          const usage = await worker.getResourceUsage();

          console.info('mediasoup Worker resource usage [pid:%d]: %o', worker.pid, usage);
      }, 120000);*/
  }
}

export default sockets;
