import { redisClient } from "../loaders/database";

export function addBlacklist(accessToken : string,expiresIn:number){
    const key = `blacklist :${accessToken}`;
    redisClient.set(key,accessToken);
    redisClient.expireAt(key,expiresIn);
    console.log(`${key} Setting Complete!`);
    return;
}
export async function checkBlacklist(accessToken:string){
    const key = `blacklist :${accessToken}`;
    return await redisClient.get(key);
}