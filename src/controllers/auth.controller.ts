// 어플리케이션의 바깥 부분 , 요청/ 응답을 처리함.
import { AuthService } from "../services/auth.service";
import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Users } from "../../models/Users";
import axios from "axios";

const acc: string =
  process.env.JWT_ACCESS_SECRET_KEY || "default_access_secret_key";
const rcc: string =
  process.env.JWT_REFRESH_SECRET_KEY || "default_refresh_secret_key";
const hash: string = process.env.BCRYPT_SALT || "default_salt_key";

const userSchema = Joi.object({
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
  nickname: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{5,15}$")),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{5,20}$")).required(),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
});

export class AuthController {
  authService = new AuthService();

  // 회원가입
  signupUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, nickname, password, confirmPassword } =
        await userSchema.validateAsync(req.body);

      const confirm = this.authService.confirm(password, confirmPassword);

      if (!confirm) {
        throw { name: "PasswordMismatch" };
      }

      const signupUser = await this.authService.signupUser(
        email,
        nickname,
        password
      );

      return res
        .status(200)
        .json({ message: " 회원 가입 성공 " });
    } catch (err) {
      next(err);
    }
  };

  // 로그인
  signinUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const user: any = req.user;
      const signinUser = await this.authService.signinUser(
        email,
        password,
        user
      );
      if (!signinUser) {
        return res.status(400).json({ message: "로그인 실패" });
      }

      res.cookie(
        "refreshToken",
        `Bearer ${decodeURIComponent(String(signinUser.refreshToken))}`
      );
      res.cookie(
        "accessToken",
        `Bearer ${decodeURIComponent(String(signinUser.accessToken))}`
      );

      return res.status(200).json({
        message: "로그인 성공",
        data: {
          accessToken: signinUser.accessToken,
          refreshToken: signinUser.refreshToken,
        },
      });
    } catch (err) {
      next(err);
    }
  };

  // 로그아웃
  signOut = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user: any = req.user;

      if (!req.user) throw { name: "UserNotFound" };

      await this.authService.signOut(user);
      return res.status(200).json({ message: " 로그아웃 성공 " });
    } catch (err) {
      next(err);
    }
  };

  // 리프레쉬 토큰 재 발급
  getRefresh = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refreshToken = req.headers["refresh"] as string | undefined;
      const accessToken = req.headers["authorization"];
      if (!refreshToken || !accessToken) {
        throw new Error(" 토큰 입력이 안되었음. ");
      }
      const decodedInfo = await this.decodedAccessToken(accessToken);

      const user = await Users.findOne({
        where: { email: decodedInfo.email },
      });
      if (!user) {
        throw new Error(" 유저 정보가 없습니다. ");
      }

      const verifyRefreshToken = await this.validateRefreshToken(
        refreshToken,
        user.hashedRefreshToken,
        res
      );
      if (verifyRefreshToken === "invalid token") {
        await Users.update(
          { hashedRefreshToken: null },
          { where: { email: user.email } }
        );
        return res.status(401).json({ message: "토큰 인증 실패" });
      }

      if (verifyRefreshToken === "jwt expired") {
        await Users.update(
          { hashedRefreshToken: null },
          { where: { email: user.email } }
        );
        throw new Error(" 로그인이 필요한 서비스 입니다. ");
      }
      const newAccessToken = await this.createAccessToken(user.email);
      const newRefreshToken = await this.createRefreshToken(user.email);

      const salt = bcrypt.genSaltSync(parseInt(hash));
      const hashedRefreshToken = bcrypt.hashSync(
        newRefreshToken || "default-token",
        salt
      );
      await Users.update({ hashedRefreshToken }, { where: { userId: user.userId } });

      return res.status(200).json({
        message: "토큰 재 발급.",
        data: { newAccessToken, newRefreshToken },
      });
    } catch (err) {
      next(err);
    }
  };

  agreedService = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user: any = req.user;
      const { agreedService } = req.body;

      if( agreedService === undefined ) {
        return res.status(400).json({ message: " 약관 동의 부탁. " })
      }
      await this.authService.agreedService(user.id, agreedService);

      return res.status(200).json({ message: "이용 동의 업데이트 완료." })
    } catch (err) {
      next(err)
    }
  }

  // kakaoLogin = async (req: Request, res: Response, next: NextFunction) => {
  //   try {
  //     const { access_token } = req.body;
  //     // Kakao 로그인 메서드 호출
  //     const result = await this.authService.kakaoSignIn(access_token);

  //     return res.status(200).json(result);
  //   } catch (err) {
  //     console.error('Error during Kakao login:', err);
  //     next(err);
  //   }
  // };

  // googleLogin = async (req: Request, res: Response, next: NextFunction) => {
  //   try {
  //     const { email, password } = req.body;
  //     const user = req.user;

  //     const loginUser = await this.authService.localSignIn(
  //       email,
  //       password,
  //       user
  //     );
  //     return res.status(200).json({ message: "ok" });
  //   } catch (error) {}
  // };

  // 토큰 값 해독 부분 잠깐 컨트롤러로 옮겨 왔음
  decodedAccessToken = (accessToken: string) => {
    try {
      const [tokenType, token] = accessToken.split(" ");
      return jwt.decode(token, { json: true }) as any;
    } catch (err) {
      throw err;
    }
  };

  // 리프레쉬 토큰도 잠깐 옮겨왔음.
  validateRefreshToken = async (
    refreshToken: string,
    hashedRefreshToken: string,
    res: Response
  ) => {
    try {
      const [tokenType, token] = refreshToken.split(" ");

      if (tokenType !== "Bearer")
        throw new Error(" 로그인이 필요한 서비스 입니다. ");

      const checkRefreshToken = await bcrypt.compare(token, hashedRefreshToken);

      if (!checkRefreshToken) {
        return res.status(400).json({ errorMessage: "잘못된 접근입니다. " });
      }

      return jwt.verify(token, rcc);
    } catch (err) {
      throw err;
    }
  };

  createAccessToken = async (email: string) => {
    try {
      const accessToken = jwt.sign(
        { email }, // JWT 데이터
        acc, // Access Token의 비밀 키
        { expiresIn: "5h" } // Access Token이 5h 뒤에 만료되도록 설정.
      );
      return accessToken;
    } catch (err) {
      throw err;
    }
  };

  createRefreshToken = async (email: string) => {
    try {
      const refreshToken = jwt.sign(
        { email }, // JWT 데이터
        rcc, // Refresh Token의 비밀 키
        { expiresIn: "7d" } // Refresh Token이 7일 뒤에 만료되도록 설정.
      );
      return refreshToken;
    } catch (err) {
      throw err;
    }
  };
}