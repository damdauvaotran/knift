import redis from 'redis';
import { promisify } from 'util';

const client = redis.createClient();
const getAsync = promisify(client.get).bind(client);

client.on('error', (error: any) => {
  console.error(error);
});

export { client, getAsync };
