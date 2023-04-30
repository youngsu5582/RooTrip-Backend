/**
 * NODE_ENV에 따른 .env 파일을 로드한다.
 */
import crypto from "crypto";

import dotenv from "dotenv";

dotenv.config({
  path: `config/.env.${process.env.NODE_ENV || "development"}`
});

/**
 * 환경 변수
 */

export const env = {
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",
  isTest: process.env.NODE_ENV === "test",
  app: {
    port: Number(process.env.PORT) || 3000,
    apiPrefix: process.env.API_PREFIX || "/api",
    jwtAccessSecret:
      process.env.JWT_SECRET_ACCESS_KEY || "Random_Secret_Access_x*nd23",
    jwtRefreshSecret:
      process.env.JWT_SECRET_REFRESH_KEY || "Random_Secret_Refresh_!@39*SD",
    CryptSecret: process.env.CRYPT_SECRET || crypto.randomBytes(16)
  },
  key: {
    kakaoRestApi: process.env.KAKAO_REST_API_KEY,
    kakaoRedirectUri: process.env.KAKAO_REDIRECT_URI,
    NaverClientId: process.env.NAVER_CLIENT_ID,
    NaverClientSecret: process.env.NAVER_CLIENT_SECRET_KEY,
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleSecretKey: process.env.GOOGLE_SECRET_KEY
  },
  database: {
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT) || 3306,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    name: process.env.DATABASE_NAME,
    logging: process.env.LOGGING
  },
  swagger: {
    route: process.env.SWAGGER_ROUTE || "/api-docs"
  },
  sentry: {
    dsn: process.env.SENTRY_DSN
  },
  s3: {
    accessKey: process.env.S3_ACCESS_KEY,
    secretKey: process.env.S3_SECRET_KEY,
    bucketName: String(process.env.S3_BUCKET_NAME)
  },
  machine : {
    url : process.env.MACHINE_URL || "http://localhost:8123"
  }
};
