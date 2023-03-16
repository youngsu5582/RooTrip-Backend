import { redisClient } from "../loaders/database";
const redisCli = redisClient.v4;
export async function addBlacklist(accessToken : string,expiresIn:number){
    const key = `blacklist :${accessToken}`;
      
    
    await redisCli.set(key,accessToken);
    
    
    await redisCli.expireAt(key,expiresIn);
    
    return;
}
export async function checkBlacklist(accessToken:string){
    const key = `blacklist :${accessToken}`;
    
    
    return Boolean(await redisCli.get(key));
}
export async function addVerify(email:string){
    const randomNumber = Math.floor(Math.random() * 100000).toString().padStart(6,'5');
    await redisClient.set(email,randomNumber);
}
export async function getVerify(email:string){
    return await redisClient.get(email);
}   