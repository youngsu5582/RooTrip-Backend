import { Request, Response } from "express";
import {
  Middleware,
  ExpressErrorMiddlewareInterface
} from "routing-controllers";
import { logger } from "../utils/Logger";
import { Service } from "typedi";

/**
 * Error를 처리하는 미들웨어
 */
@Service()
@Middleware({ type: "after" })
export class ErrorHandler implements ExpressErrorMiddlewareInterface {
  error(errors: any, req: Request, res: Response): void {
    logger.error(errors);
    if (errors.length !== 0) {
      res.status(200).send({
        message: "Missing required parameter",
        errors: errors
      });
    }
  }
}
