import crypto from 'crypto';
export function encrypt(id:string){
    return crypto.createHash('sha256').update(id).digest('hex').slice(0,36);
}