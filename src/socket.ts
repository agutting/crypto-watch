import { client as WebSocketClient } from 'websocket';
import { insertTrade } from './data-storage';
import { CreateTradeInput } from './types';

export const connectCoinbase = (productIds: string[], channels: string[]) => {
  const cbSocket = new WebSocketClient();
  const subscribeMessage = { type: "subscribe", channels: new Array() };
  channels.forEach(c => {
    subscribeMessage.channels.push({
      name: c,
      product_ids: productIds,
    });
  });

  cbSocket.on('connect', connection => {
    console.log(`Connected to ${process.env.COINBASE_URL}`);

    connection.on('error', err => {
      console.error(`Error encountered: ${err}`);
    });

    connection.sendUTF(JSON.stringify(subscribeMessage));

    connection.on('close', () => {
      console.log(`Connection to ${process.env.COINBASE_URL} closed`);
    });

    connection.on('message', async message => {
      if (message.type === 'utf8' && message.utf8Data) {
        const parsedMessage = JSON.parse(message.utf8Data) as CreateTradeInput;
        if (parsedMessage.type === 'ticker') {
          await insertTrade(parsedMessage);
        }
      }
    });
  });

  cbSocket.connect(process.env.COINBASE_URL as string);
}