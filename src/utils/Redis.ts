import { redisClient } from "../loaders/database";

export async function addBlacklist(accessToken : string,expiresIn:number){
    const key = `blacklist : ${accessToken}`;
    
    try{
        await redisClient.connect();
        await redisClient.set(key,1,{
            EX:expiresIn
        });
        redisClient.disconnect();
    }
    catch(err){
        return err;
    }

    return;
}
export async function checkBlacklist(accessToken:string){
    redisClient.connect();
    const key = `blacklist : ${accessToken}`;
    const result = (await redisClient.get(key));
    redisClient.disconnect();
    return result;
}
export async function addVerify(email:string){
    const randomNumber = Math.floor(Math.random() * 100000).toString().padStart(6,'5');
    await redisClient.set(email,randomNumber);
}
export async function getVerify(email:string){
    return await redisClient.get(email);
}   