import { env } from "./env";
import AWS from "aws-sdk";
import { DataSource } from "typeorm";
import { createClient } from "redis";
const { database, s3 } = env;
export default new DataSource({
  type: "mysql",
  host: database.host,
  port: database.port,
  username: database.username,
  password: database.password,
  database: database.name,
  synchronize: true,
  connectTimeout: 20000,
  acquireTimeout: 20000,
  legacySpatialSupport:false,
  entities: [__dirname + "/../entities/*{.ts,.js}"]
});

const redisClient = createClient();
const s3Client = new AWS.S3({
  signatureVersion: "s3v4",
  region: "ap-northeast-2",

  credentials: {
    accessKeyId: s3.accessKey!,
    secretAccessKey: s3.secretKey!
  }
});

export { redisClient, s3Client };
