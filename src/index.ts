import dotenv from 'dotenv';
import {connectCoinbase} from './socket';
dotenv.config();

connectCoinbase();