import { Request, Response, NextFunction } from "express";
import { Users } from "../../models/Users";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const acc: string = process.env.JWT_ACCESS_SECRET_KEY!;
const rcc: string = process.env.JWT_REFRESH_SECRET_KEY!;
const hash: string = process.env.BCRYPT_SALT!;

export default async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const accessToken = req.headers.authorization;

    if (!accessToken) {
      throw new Error("로그인이 필요한 서비스입니다.");
    }
    const verifyAccessToken = await validateAccessToken(accessToken, res, next);

    if(verifyAccessToken === "invalid token") {
        return res.status(401).json({ message: "토큰이 인증에 실패하였습니다." });
      }
      if(verifyAccessToken === "jwt expired" || !verifyAccessToken?.email) {
        return res.status(401).json({ message: "토큰이 만료되었거나 유저 정보가 없습니다." });
      }
    const email = verifyAccessToken.email;
    
    const user = await Users.findOne({
      where: { email },
    });
    if (!user) {
      throw new Error("토큰 사용자가 존재하지 않습니다.");
    }

    req.user = user;
    next();
    
  } catch (err) {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    const error: Error = err as Error;
    
    switch (error.name) {
        case "TokenExpiredError":
          return res.status(401).json({ message: "토큰이 만료되었습니다." });
        case "JsonWebTokenError":
          return res.status(401).json({ message: "토큰이 인증에 실패하였습니다." });
        default:
          return res.status(401).json({ message: error.message ?? "비정상적인 요청입니다." });
      }
    }
}

async function validateAccessToken(
    accessToken: string,
    res: Response,
    next: NextFunction
  ): Promise<any> { 
    try {
      const [tokenType, token] = accessToken.split(" ");
  
      if (tokenType !== "Bearer") {
        throw new Error("로그인이 필요한 서비스입니다.");
      }
      return jwt.verify(token, acc);
    } catch (err) {
      next(err);
    }
  }
