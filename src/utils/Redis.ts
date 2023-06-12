import { createClient } from "redis";

export async function addBlacklist(accessToken: string, expiresIn: number) {
  const key = `blacklist : ${accessToken}`;

  try {
    const redisClient = createClient();
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
    const redisClient = createClient();
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
    const redisClient = createClient();
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
    const redisClient = createClient();
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
    const redisClient = createClient();
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
  const storage = `todayPosts`;
  const key = `postViews:${postId}`;
  try{
    const redisClient = createClient();
    await redisClient.pfAdd(key,userId);
    await redisClient.sAdd(storage,postId);
    return redisClient.quit();
  }
  catch{
    throw Error
  }
}
export async function deletePostViews(postId:string){
  const storage = `todayPosts`;
  const key = `postViews:${postId}`;
  try{
    const redisClient = createClient();
    await redisClient.del(key);
    await redisClient.sRem(storage,postId);
    return redisClient.quit();
  }
  catch{
    throw Error
  }

}
export async function getPostViews(postId:string){
  try{
    const redisClient = createClient();
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
export async function deleteAllPostViews(keys:string[]){
  try{
    const redisClient = createClient();
    redisClient.connect();
    await redisClient.del(keys);
    redisClient.disconnect();
    return;
  }
  catch{
    throw Error
  }
}
export async function getAllPostViews(){
  let keys =[];
  try{
    const storage = `todayPosts`;
    const redisClient = createClient();
    redisClient.connect();
    keys = await redisClient.sMembers(storage);
    redisClient.disconnect();
    return keys;
  }
  catch{
    throw Error
  }
}
/**
 * 2023.05.28 Redis 의 pfAdd & pfCount 를 사용할 시 , 중복 Check를 할 필요가 없는거 같아 주석.
 * 
 */
// export async function deletePostSets(){
//   try{
//     redisClient.connect();
//     const keys = await redisClient.keys('postViews:*');
//     if(keys)await redisClient.del(keys);
//     redisClient.disconnect();
//     return;
//   }
//   catch{
//     throw Error
//   }
// }

