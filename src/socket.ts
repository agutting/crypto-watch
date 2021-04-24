import { client as WebSocketClient } from 'websocket';

export const connectCoinbase = () => {
  const cbSocket = new WebSocketClient();
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
    console.log(`Connected to ${process.env.COINBASE_URL}`);

    connection.on('error', err => {
      console.error(`Error encountered: ${err}`);
    });

    connection.sendUTF(subscribeMessage);

    connection.on('close', () => {
      console.log(`Connection to ${process.env.COINBASE_URL} closed`);
    });

    connection.on('message', message => {
      if (message.type === 'utf8' && message.utf8Data) {
        const ethMessage = JSON.parse(message.utf8Data)
        // the `sequence` property, which uniquely identifies a websocket message, is not sequential
        // trade_id is sequential and every trade is sent
        if ((ethMessage.trade_id)) {
          const date = `${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`;
          console.log(`[${date}]:`);
          console.table(JSON.parse(message.utf8Data));
        }
      }
    });
  });

  cbSocket.connect(process.env.COINBASE_URL as string);
}