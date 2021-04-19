import config from './config';
import { Socket } from 'socket.io';


export class Room {
  public id: string;
  public peers: Map<string, any>;
  public io: any;
  public router: any;

  constructor(roomId: string, worker: any, io: any) {
    this.id = roomId;
    const mediaCodecs = config.mediasoup.router.mediaCodecs;
    worker
      .createRouter({
        mediaCodecs,
      })
      .then((router: any) => {
        this.router = router;
      });

    this.peers = new Map();
    this.io = io;
  }

  addPeer(peer: any) {
    this.peers.set(peer.id, peer);
  }

  getProducerListForPeer(socketId: string) {
    let producerList: any[] = [];
    this.peers.forEach((peer) => {
      peer.producers.forEach((producer: any) => {
        producerList.push({
          producerId: producer.id,
        });
      });
    });
    return producerList;
  }

  getRtpCapabilities() {
    return this.router.rtpCapabilities;
  }

  async createWebRtcTransport(socketId: string) {
    const {
      maxIncomingBitrate,
      initialAvailableOutgoingBitrate,
    } = config.mediasoup.webRtcTransport;

    const transport = await this.router.createWebRtcTransport({
      listenIps: config.mediasoup.webRtcTransport.listenIps,
      enableUdp: true,
      enableTcp: true,
      preferUdp: true,
      initialAvailableOutgoingBitrate,
    });
    if (maxIncomingBitrate) {
      try {
        await transport.setMaxIncomingBitrate(maxIncomingBitrate);
      } catch (error) {}
    }

    transport.on('dtlsstatechange', (dtlsState: string) => {
      if (dtlsState === 'closed') {
        console.log(
          '---transport close--- ' + this.peers.get(socketId).name + ' closed'
        );
        transport.close();
      }
    });

    transport.on('close', () => {
      console.log(
        '---transport close--- ' + this.peers.get(socketId).name + ' closed'
      );
    });
    console.log('---adding transport---', transport.id);
    this.peers.get(socketId).addTransport(transport);
    return {
      params: {
        id: transport.id,
        iceParameters: transport.iceParameters,
        iceCandidates: transport.iceCandidates,
        dtlsParameters: transport.dtlsParameters,
      },
    };
  }

  async connectPeerTransport(socketId: string, transportId: string, dtlsParameters: any) {
    if (!this.peers.has(socketId)) return;
    await this.peers
      .get(socketId)
      .connectTransport(transportId, dtlsParameters);
  }

  async produce(socketId: string, producerTransportId: string, rtpParameters: any, kind: string) {
    // handle undefined errors
    return new Promise(
      async  (resolve: Function, reject: Function)=> {
        let producer = await this.peers
          .get(socketId)
          .createProducer(producerTransportId, rtpParameters, kind);
        resolve(producer.id);
        this.broadCast(socketId, 'newProducers', [
          {
            producerId: producer.id,
            producerSocketId: socketId,
          },
        ]);
      }
    );
  }

  async consume(
    socketId: string,
    consumerTransportId: string,
    producerId: string,
    rtpCapabilities: any
  ) {
    // handle nulls
    if (
      !this.router.canConsume({
        producerId,
        rtpCapabilities,
      })
    ) {
      console.error('can not consume');
      return;
    }

    let { consumer, params } = await this.peers
      .get(socketId)
      .createConsumer(consumerTransportId, producerId, rtpCapabilities);

    consumer.on(
      'producerclose',
      ()=> {
        console.log(
          `---consumer closed--- due to producerclose event  name:${
            this.peers.get(socketId).name
          } consumer_id: ${consumer.id}`
        );
        this.peers.get(socketId).removeConsumer(consumer.id);
        // tell client consumer is dead
        this.io.to(socketId).emit('consumerClosed', {
          consumerId: consumer.id,
        });
      }
    );

    return params;
  }

  async removePeer(socketId: string) {
    this.peers.get(socketId).close();
    this.peers.delete(socketId);
  }

  closeProducer(socketId: string, producerId: string) {
    this.peers.get(socketId).closeProducer(producerId);
  }

  broadCast(socketId: string, name: string, data: any) {
    for (let otherID of Array.from(this.peers.keys()).filter(
      (id) => id !== socketId
    )) {
      this.send(otherID, name, data);
    }
  }

  send(socketId: string, name: string, data: any) {
    this.io.to(socketId).emit(name, data);
  }

  getPeers() {
    return this.peers;
  }

  toJson() {
    return {
      id: this.id,
      peers: JSON.stringify(Array.from(this.peers)),
    };
  }
}
