
import {S3Client,PutObjectCommand , ListBucketsCommand} from '@aws-sdk/client-s3';

import {env} from './env';
import { logger } from '../utils/Logger';
import AWS from 'aws-sdk';

const s3 = env.s3;
const client = new AWS.S3({credentials:{
    accessKeyId:s3.accessKey!,
    secretAccessKey:s3.secretKey!
}})


// const client = new S3Client({
//     credentials:{

//         accessKeyId : s3.accessKey!,
//         secretAccessKey:s3.secretKey!
//     },
//     apiVersion:'2006-03-01',
//     region:'ap-northeast-2',
    
// })


export async function uploadFile(fileName:string,fileData:any){
  
    try{

          const result = await client.putObject({Key:`${Date.now()}_${fileName}`,Body:fileData,Bucket:s3.bucketName}).promise();
          
          console.log(result);
        //}))
        
        return result;
    }
    catch(error){
        logger.error(error);
    }
}

export async function getFile(fileName:string){
    
    try{
        const result = await client.getObject({Bucket:env.s3.bucketName,Key:fileName}).promise();
        console.log(result);
        return result;
    }
    catch(error){
        logger.error(error);
    }
}