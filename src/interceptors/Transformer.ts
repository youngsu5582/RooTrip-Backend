import typia from "typia";
import { ERROR } from "../errors";
import { Catch, Try } from "../types";
import { env } from "../loaders/env";
import { logger } from "../utils/Logger";
const isDevelopment = env.isDevelopment;
export function createResponseForm<T>(data: T, message?: string):  Try<T> {
  return {
    status: true,
    ...(data !== null && {data }),
    message,
  } as const;
}


export function createErrorForm<T extends ERROR>(data : T,metadata?:any) : Catch<T> {
  
  if(isDevelopment && metadata)
    logger.info(metadata);
  return data;
}