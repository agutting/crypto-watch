import dotenv from 'dotenv';
import { connectCoinbase } from './socket';
dotenv.config();

connectCoinbase(['ETH-USD', 'BTC-USD'], ['ticker']);