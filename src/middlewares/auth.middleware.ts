import { Request, Response, NextFunction } from "express";
import { Users } from "../../models/Users";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const acc: string = process.env.JWT_ACCESS_SECRET_KEY!;
const rcc: string = process.env.JWT_REFRESH_SECRET_KEY!;
const hash: string = process.env.BCRYPT_SALT!;

export default async function (req: Request, res: Response, next: NextFunction) {
  try {
    const accessToken = req.headers.authorization

    if (!accessToken) {
      throw new Error(" need login ")
    }

    const verifyAccessToken = validateAccessToken(accessToken);
    if (verifyAccessToken === "invalid token") {
      return res.status(401).json({ message: "토큰 인즈 실패" })
    }

    if(verifyAccessToken === "jwt expired") {
      return res.status(401).json({ message: "토큰이 만료 되었습니다." });
    }

    const email = verifyAccessToken.email
    const user = await Users.findOne({
      where: { email }
    })

    if(!user) {
      throw new Error (" 토큰 사용자 없음 ")
    }

    req.user = user

    next()

  } catch (error:any) {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    switch (error.name) {
      case "TokenExpiredError":
        return res.status(401).json({ message: "토큰이 만료 되었습니다." });
      case "JsonWebTokenError":
        return res
          .status(401)
          .json({ message: "토큰이 인증에 실패 하였습니다." });
      default:
        return res
          .status(401)
          .json({ message: error.message ?? "비정상적인 요청입니다." });
    }
  }
}

function validateAccessToken(accessToken:any) {
  try {
    const [tokenType, token] = accessToken.split(" ");

    if (tokenType !== "Bearer")
      throw new Error(" 로그인이 필요한 서비스 입니다. ");

      return jwt.verify(token, acc);
  } catch (error:any) {
    return error.message
  }
}