import { redisClient } from "../loaders/database";

export async function addBlacklist(accessToken: string, expiresIn: number) {
  const key = `blacklist : ${accessToken}`;

  try {
    await redisClient.connect();
    await redisClient.set(key, 1, {
      EX: expiresIn
    });
    redisClient.disconnect();
  } catch (err) {
    return err;
  }

  return;
}
export async function checkBlacklist(accessToken: string) {
  try {
    redisClient.connect();
    const key = `blacklist : ${accessToken}`;
    const result = Boolean(await redisClient.get(key));
    redisClient.disconnect();
    return result;
  } catch (err) {
    throw Error;
  }
}
export async function addVerify(email: string, randomNumber: string) {
  const key = `verify : ${email}`;

  try {
    await redisClient.connect();
    await redisClient.set(key, randomNumber, {
      EX: 180
    });
    redisClient.disconnect();
  } catch (err) {
    throw Error;
  }
}
export async function getVerify(email: string) {
  try {
    redisClient.connect();
    const key = `verify : ${email}`;
    const result = await redisClient.get(key);
    redisClient.disconnect();
    return result;
  } catch (err) {
    throw Error;
  }
}
export async function checkPostViews(postId:string,userId:string){
  const key = `postViewed:${userId}`;
  try{
    redisClient.connect();
    const result =  await redisClient.sIsMember(key,postId);
    redisClient.disconnect();
    return result;
  }
  catch {
    throw Error
  }
}
export async function increasePostViews(postId:string,userId:string){
  try{
    redisClient.connect();
    const key = `postViews:${postId}`;
    const log = `postViewed:${userId}`;
    await redisClient.pfAdd(key,userId);
    await redisClient.sAdd(log,postId);
    return redisClient.disconnect();
    
  }
  catch{
    throw Error
  }
}
export async function getPostViews(postId:string){
  try{
    redisClient.connect();
    const key = `postViews:${postId}`;
    const result = await redisClient.pfCount(key);
    redisClient.disconnect();
    return result;
  }
  catch{
    throw Error
  }

}
export async function deletePostViews(postId:string){
  try{
    redisClient.connect();
  const key = `postViews:${postId}`;
  if(await redisClient.exists(key)){
    await redisClient.del(key);
  }
  redisClient.disconnect();
  return;
  }
  catch{
    throw Error
  }
}
export async function deletePostSets(){
  try{
    redisClient.connect();
    const keys = await redisClient.keys('postViews:*');
    if(keys)await redisClient.del(keys);
    redisClient.disconnect();
    return;
  }
  catch{
    throw Error
  }

}