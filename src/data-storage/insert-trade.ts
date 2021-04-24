import { PrismaClient, Trade } from '@prisma/client';
import { CreateTradeInput } from '../types';

export const insertTrade = async (trade: CreateTradeInput) => {
  const prisma = new PrismaClient();
  try {
    await prisma.trade.create({
      data: {
        id: trade.trade_id,
        quantity: parseFloat(trade.last_size),
        time: new Date(trade.time),
        action: trade.side === 'buy' ? 'BUY' : 'SELL',
        product_id: trade.product_id,
        price: parseFloat(trade.price),
        open_24h: parseFloat(trade.open_24h),
        volume_24h: parseFloat(trade.volume_24h),
        low_24h: parseFloat(trade.low_24h),
        high_24h: parseFloat(trade.high_24h),
        volume_30d: parseFloat(trade.volume_30d),
        best_bid: parseFloat(trade.best_bid),
        best_ask: parseFloat(trade.best_ask),
      }
    });
    await prisma.$disconnect();
    console.log(`Added ${trade.product_id} trade ${trade.trade_id} to database`);
  } catch (err) {
    console.log(err);
  }
};