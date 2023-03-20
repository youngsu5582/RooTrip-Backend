import { CronJob } from 'cron';
import {LessThan} from 'typeorm';
import { PostRepository } from '../repositories';
import { logger } from '../utils/Logger';
const expire = 24 * 60 * 60 * 1000;
export default new CronJob('* 4 * * *',async()=>{
    const expiredTime = new Date(Date.now()-expire);
    const posts = await PostRepository.find({where:{createdAt:LessThan(expiredTime)}});
    if(posts){
        try{
            await PostRepository.remove(posts);
        }
        catch(err){
            logger.error(err);
        }
    }
},null,false,'Asia/Seoul');
