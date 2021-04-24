import { client as WebSocketClient } from 'websocket';

const cbSocket = new WebSocketClient();
const coinbaseSocketURL = 'wss://ws-feed.pro.coinbase.com';
const subscribeMessage = JSON.stringify({
  type: "subscribe",
  channels: [
    {
      name: "ticker",
      product_ids: ["ETH-USD"],
    },
  ],
});

cbSocket.on('connect', connection => {
  console.log(`Connected to ${coinbaseSocketURL}`);

  connection.on('error', err => {
    console.error(`Error encountered: ${err}`);
  });

  connection.sendUTF(subscribeMessage);

  connection.on('close', () => {
    console.log(`Connection to ${coinbaseSocketURL} closed`);
  });

  connection.on('message', message => {
    if (message.type === 'utf8' && message.utf8Data) {
      const ethMessage = JSON.parse(message.utf8Data)
      // the `sequence` property, which uniquely identifies a websocket message, is not sequential
      // trade_id is sequential and every trade is sent
      if (!(ethMessage.trade_id % 50)) {
        console.log(`[${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}]: ${message.utf8Data}`);
      }
    }
  });
});

const connectCoinbaseSocket = () => {
    cbSocket.connect(coinbaseSocketURL);
};

export default connectCoinbaseSocket;