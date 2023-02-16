import { Request, Response, NextFunction } from "express";

import { env } from "../loaders/env";


/**
 * Request Session 에서 userId가 있는지 확인한다.
 * @param req
 * @param res
 * @param next
 */
export const checkLogin = (req: Request,res:Response,next:NextFunction) => {
  if (req.session.userId) next();
  else res.status(401).send({message:'Login Please'});
};
