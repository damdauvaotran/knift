export class Peer {
  public id: string;
  public name: string;
  public role: string;
  public transports: Map<string, any>;
  public consumers: Map<string, any>;
  public producers: Map<string, any>;

  constructor(socketId: string, name: string, role: string) {
    this.id = socketId;
    this.name = name;
    this.role = role;
    this.transports = new Map();
    this.consumers = new Map();
    this.producers = new Map();
  }

  addTransport(transport: any) {
    this.transports.set(transport.id, transport);
  }

  async connectTransport(transportId: string, dtlsParameters: any) {
    if (!this.transports.has(transportId)) return;
    await this.transports.get(transportId).connect({
      dtlsParameters: dtlsParameters,
    });
  }

  async createProducer(
    producerTransportId: string,
    rtpParameters: any,
    kind: string,
  ) {
    //TODO handle null errors
    let producer = await this.transports.get(producerTransportId).produce({
      kind,
      rtpParameters,
      appData: {
        userId: this.name,
        role: this.role,
      }
    });

    this.producers.set(producer.id, producer);

    producer.on('transportclose', () => {
      console.log(
        `---producer transport close--- name: ${this.name} consumer_id: ${producer.id}`
      );
      producer.close();
      this.producers.delete(producer.id);
    });

    return producer;
  }

  async createConsumer(
    consumerTransportId: string,
    producerId: string,
    rtpCapabilities: any
  ) {
    let consumerTransport = this.transports.get(consumerTransportId);

    let consumer: any = null;
    try {
      consumer = await consumerTransport.consume({
        producerId: producerId,
        rtpCapabilities,
        paused: false, //producer.kind === 'video',
      });
    } catch (error) {
      console.error('consume failed', error);
      return;
    }


    if (consumer.type === 'simulcast') {
      await consumer.setPreferredLayers({
        spatialLayer: 2,
        temporalLayer: 2,
      });
    }

    this.consumers.set(consumer.id, consumer);

    consumer.on('transportclose', () => {
      console.log(
        `---consumer transport close--- name: ${this.name} consumer_id: ${consumer.id}`
      );
      this.consumers.delete(consumer.id);
    });

    return {
      consumer,
      params: {
        producerId: producerId,
        id: consumer.id,
        kind: consumer.kind,
        rtpParameters: consumer.rtpParameters,
        type: consumer.type,
        producerPaused: consumer.producerPaused,
      },
    };
  }

  closeProducer(producerId: string) {
    try {
      this.producers.get(producerId).close();
    } catch (e) {
      console.warn(e);
    }

    this.producers.delete(producerId);
  }

  getProducer(producerId: string) {
    return this.producers.get(producerId);
  }

  close() {
    this.transports.forEach((transport) => transport.close());
  }

  removeConsumer(consumerId: string) {
    this.consumers.delete(consumerId);
  }
}
