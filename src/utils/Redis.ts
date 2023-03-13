import { redisClient } from "../loaders/database";

export async function addBlacklist(accessToken : string,expiresIn:number){
    const key = `blacklist :${accessToken}`;
    await redisClient.set(key,accessToken);
    await redisClient.expireAt(key,expiresIn);
    return;
}
export async function checkBlacklist(accessToken:string){
    const key = `blacklist :${accessToken}`;
    return Boolean(await redisClient.get(key));
}