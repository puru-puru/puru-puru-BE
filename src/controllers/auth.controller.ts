// 어플리케이션의 바깥 부분 , 요청/ 응답을 처리함.
import { User } from "../types/customtype/express";
import { AuthService } from "../services/auth.service";
import { Request, Response, NextFunction } from "express";
import Joi, { string } from "joi";
import axios from "axios";

const userSchema = Joi.object({
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
  nickname: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{5,15}$")),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{5,20}$")).required(),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
});

export class AuthController {
  authService = new AuthService();

  // 회원가입
  signupUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, nickname, password, confirmPassword } = await userSchema.validateAsync(req.body);
      console.log("Confirm Password:", confirmPassword);
        const confrim = this.authService.confrim(password, confirmPassword);

    if (!confrim) {
      throw { name: "PasswordMismatch" };
    }

      const signupUser = await this.authService.signupUser(
        email,
        nickname,
        password,
      );

      return res
        .status(200)
        .json({ message: " 회원 가입 성공 ", data: signupUser });
    } catch (err) {
      next(err);
    }
  };

  // 로그인
  signinUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const user: any = req.user;

      const signinUser = await this.authService.signinUser(email, password, user);
      if (!signinUser) {
        return res.status(400).json({ message: "로그인 실패" });
      }

      res.cookie(
        "refreshToken",
        `Bearer ${decodeURIComponent(String(signinUser.refreshToken))}`
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

      await this.authService.signOut(
        user
        );
      return res.status(200).json({ message: " 로그아웃 성공 " });
    } catch (err) {
      next(err);
    }
  };

  kakaoLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { access_token } = req.body;
      // Kakao 로그인 메서드 호출
      const result = await this.authService.kakaoSignIn(access_token);

      return res.status(200).json(result);
    } catch (err) {
      console.error('Error during Kakao login:', err);
      next(err);
    }
  };

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
}
