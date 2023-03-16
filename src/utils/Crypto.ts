import {AES} from 'crypto-js';
import {env} from '../loaders/env';
import crypto from 'crypto';

const secretKey = env.app.CryptSecret;
export function encrypt(id:string){
    const iv = 'abcdef1234567890';
    const cipher = crypto.createCipheriv('aes-128-ccm',Buffer.from(secretKey,'utf8'),iv);
    return cipher.update(id,'utf8','base64')+cipher.final('base64').toString();
}