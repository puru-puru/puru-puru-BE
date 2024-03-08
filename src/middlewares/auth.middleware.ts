import { Request, Response, NextFunction } from "express";
import { Users } from "../../models/Users";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { decode } from "punycode";

const acc: string = process.env.JWT_ACCESS_SECRET_KEY || "default_access_secret_key";
const rcc: string = process.env.JWT_REFRESH_SECRET_KEY || "default_refresh_secret_key";
const hash: string = process.env.BCRYPT_SALT!;

export default async function (req: Request, res: Response, next: NextFunction) {
  try {
    const accessToken = req.headers.authorization

    // 여기서 부터 토큰에 대해서 오류에 대한 경우의 수를 기재함. 
    // 말 그대로 토큰이 없는 경우.
    if (!accessToken) {
      throw new Error(" 로그인이 필요한 서비스 입니다. ")
    }

    // 말 그대로 토큰 인증에 실패 할 경우.
    const verifyAccessToken = validateAccessToken(accessToken);
    if (verifyAccessToken === "invalid token") {
      return res.status(401).json({ message: "토큰 인즈 실패" })
    }

    // 토큰이 만료 되었을 경우.
    if(verifyAccessToken === "jwt expired") {
      return res.status(401).json({ message: "토큰이 만료 되었습니다." });
    }

    // 토큰 인증이 되었다면.
    const email = verifyAccessToken!.email
    const user = await Users.findOne({
      where: { email }
    })

    if(!user) {
      throw new Error (" 토큰 사용자 없음 ")
    }

    // 사용자의 정보를 담아서 다른 서비스 에서 사용 할 수 있게 넘김.
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

function validateAccessToken(accessToken: any): JwtPayload | any {
  try {
    const [tokenType, token] = accessToken.split(" ");

    if (tokenType !== "Bearer")
      throw new Error("토큰 타입이 일치하지 않습니다.");

      const decodedToken = jwt.verify(token, acc);
      return decodedToken as JwtPayload;
  } catch (error: any) {
    return null;
  }
}