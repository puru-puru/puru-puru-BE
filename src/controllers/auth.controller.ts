// 어플리케이션의 바깥 부분 , 요청/ 응답을 처리함.
import { User } from "../types/customtype/express";
import { AuthService } from "../services/auth.service";
import { Request, Response, NextFunction } from "express";
import Joi from 'joi'

const userSchema = Joi.object({
  email: Joi.string().email({ minDomainSegments:2, tlds: { allow: ['com', 'net'] }}),
  nickname: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{5,15}$")),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{5,20}$")).required(),
})

export class AuthController {
  authService = new AuthService();

  // 회원가입.
  signupUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {  nickname, email, password } = await userSchema.validateAsync( req.body )
      const signupUser = await this.authService.signupUser(
        nickname,
        email,
        password,
        next
      );

      return res.status(200).json({ message: " 회원 가입에 성공 하셨습니다. ",data: signupUser });
    } catch (err) {
      next(err)
    }
  };

  // 로그인.
  loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const user = req.user; 
      console.log("-----------------------------------", email, password)

      const loginUser = await this.authService.loginUser(
        email,
        password,
        user,
        res,
        next
      );
      console.log(loginUser);
      if (!loginUser) {
        return res.status(400).json({ message: " 로그인 실패패 " });
      }
      return res.status(200).json({ message: " 로그인 성공 " });
    } catch (error) {}
  };

  // kakaoLogin = async (req: Request, res: Response, next: NextFunction) => {
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
