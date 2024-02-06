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
});

export class AuthController {
  authService = new AuthService();

  // 회원가입
  signupUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { nickname, email, password } = await userSchema.validateAsync(
        req.body
      );
      const signupUser = await this.authService.signupUser(
        nickname,
        email,
        password
      );

      return res.status(200).json({ message:" 회원 가입 성공 ", data: signupUser });
    } catch (err: any) {
      if (err.name === "ValidationError") {
        return res.status(400).json({ errorMessage: "데이터 형식이 올바르지 않습니다." });
      } else if (err.name === "ExistUser") {
        return res.status(409).json({ errorMessage: "이미 사용 중인 이메일입니다." });
      }
      next(err);
    }
  };

  // 로그인
  loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const user: any = req.user;

      const loginUser = await this.authService.loginUser(email, password, user);
      if (!loginUser) {
        return res.status(400).json({ message: "로그인 실패" });
      }
      // 토큰 발급시에 바디에 넣어야 하는데 서비스 단에서 하지 못해 컨트롤러로 넘겼음.. ㅠㅠㅠ
      // res.cookie(
      //   "accessToken",
      //   `Bearer ${decodeURIComponent(String(loginUser.accessToken))}`
      // );
      res.cookie(
        "refreshToken",
        `Bearer ${decodeURIComponent(String(loginUser.refreshToken))}`
      );

      return res.status(200).json({
        message: "로그인 성공",
        data: {
          accessToken: loginUser.accessToken,
          refreshToken: loginUser.refreshToken,
        },
      });
    } catch(err) {
      next(err)
    }
  };

  // 로그아웃
  logoutUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("로그아웃 라우트 도착");
      const user: any = req.user;
      // console.log(user, '-----------------');
  
      if (!req.user) throw { name: "UserNotFound" }
  
      await this.authService.logoutUser(user)
      console.log("로그아웃 라우트 성공");
      return res.status(200).json({ message: "로그 아웃 " })
    } catch (err) {
      console.error("로그아웃 라우트 오류:", err);
      next(err)
    }
  }

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