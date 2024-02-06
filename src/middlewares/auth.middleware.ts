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

    if (!accessToken) {
      console.error("로그인이 필요한 서비스입니다.");
      throw new Error(" 로그인이 필요한 서비스 입니다. ")
    }

    const verifyAccessToken = validateAccessToken(accessToken);
    if (verifyAccessToken === "invalid token") {
      console.error("토큰 인증 실패: invalid token");
      return res.status(401).json({ message: "토큰 인즈 실패" })
    }

    if(verifyAccessToken === "jwt expired") {
      console.error("토큰 만료됨: jwt expired");
      return res.status(401).json({ message: "토큰이 만료 되었습니다." });
    }

    const email = verifyAccessToken!.email
    console.log("user nemail", email)
    const user = await Users.findOne({
      where: { email }
    })

    if(!user) {
      console.error("토큰 사용자 찾을 수 없음");
      throw new Error (" 토큰 사용자 없음 ")
    }

    req.user = user
    next()

  } catch (error:any) {
    console.error("미들웨어 오류",error)
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

    console.log("Received Token:", accessToken); // 디버깅 로그 추가

    if (tokenType !== "Bearer")
      throw new Error("로그인이 필요한 서비스입니다.");

      const decodedToken = jwt.verify(token, acc);
      console.log("Decoded Token:", decodedToken); 

      return decodedToken as JwtPayload;
  } catch (error: any) {
    console.error("Token Validation Error:", error);
    return null;
  }
}