import { env } from "../loaders/env";
import { s3Client as client } from "../loaders/database";
import { logger } from "./Logger";
const bucketName = env.s3.bucketName;

export async function signedUrl(objectKeys: string[]) {
  return objectKeys.map((objectKey) =>
    client.getSignedUrl("putObject", {
      //ACL : 'public-read',
      Bucket: bucketName,
      Key: objectKey,
      Expires: 1800,
      ContentType: "image/*"
    })
  );
}

export async function uploadFile(fileName: string, fileData: any) {
  try {
    const result = await client
      .putObject({
        Key: `${Date.now()}_${fileName}`,
        Body: fileData,
        Bucket: bucketName
      })
      .promise();
    return result;
  } catch (error) {
    logger.error(error);
    new Error();
  }
}

export async function getFile(fileName: string) {
  try {
    const result = await client
      .getObject({ Bucket: bucketName, Key: fileName })
      .promise();
    return result;
  } catch (error) {
    logger.error(error);
  }
}
