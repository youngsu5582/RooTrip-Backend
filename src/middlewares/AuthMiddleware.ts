import { Request, Response, NextFunction } from "express";
import { decodeAccessToken, decodeRefreshToken } from "../utils/jwToken";
import { checkBlacklist } from "../utils/Redis";
/**
 * 헤더에서 AccessToken을 추출한다.
 * @param req
 */
export const extractAccessToken = (req: Request) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    console.log(req.headers.authorization);
    return req.headers.authorization.split(" ")[1];
  }
};

/**
 * RefreshToken을 추출한다.
 * @param req
 */
export const extractRefreshToken = (req: Request) => {
  if (req.body.refresh_token && req.body.grant_type === "refresh_token") {
    return req.body.refresh_token;
  }
};

/**
 * JWT AccessToken을 체크한다.
 * @param req
 * @param res
 * @param next
 */
export const checkAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = extractAccessToken(req);
  
  try {
    const jwtPayload = decodeAccessToken(token!);
    if (await checkBlacklist(token!)) {
      throw Error;
    }
    res.locals.jwtPayload = jwtPayload as any;
    res.locals.token = token!;
  } catch (error) {
    
    return res.status(401).send({ message: "Invalid or Missing JWT token" });
  }

  next();
};

/**
 * JWT RefreshToken을 체크한다.
 * @param reqfh
 * @param res
 * @param next
 */
export const checkRefreshToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = extractRefreshToken(req);
  try {
    const jwtPayload = decodeRefreshToken(token);
    res.locals.jwtPayload = jwtPayload;
    res.locals.token = token;
  } catch (error) {
    return res.status(401).send({ message: "Invalid or Missing JWT token" });
  }

  next();
};
