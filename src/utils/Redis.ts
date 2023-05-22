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
  return await redisClient.sIsMember(key,postId);
}
export async function increasePostViews(postId:string,userId:string){
  const key = `postViews:${postId}`;
  const log = `postViewed:${userId}`;
  await redisClient.pfAdd(key,userId);
    await redisClient.sAdd(log,postId);
}
export async function getPostViews(postId:string){
  const key = `postViews:${postId}`;
    return await redisClient.pfCount(key);
}
export async function deletePostViews(postId:string){
  const key = `postViews:${postId}`;
  if(await redisClient.exists(key)){
    return await redisClient.del(key);
  }
}
export async function deletePostSets(){
  const keys = await redisClient.keys('postViews:*');
  if(keys)return await redisClient.del(keys);

}