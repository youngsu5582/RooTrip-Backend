import {AES} from 'crypto-js';
import {env} from '../loaders/env';
import crypto from 'crypto';


const secretKey = env.app.CryptSecret;
export function encrypt(id:string){
    return crypto.createHash('sha256').update(id).digest('hex').slice(0,36);
}