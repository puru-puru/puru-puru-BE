// 어플리케이션의 바깥 부분 , 요청/ 응답을 처리함.

import { AuthService } from "../services/auth.service";
import { UsersService } from "../services/users.service";
import Express, { Request, Response, NextFunction } from "express";

export class AuthController {
  authService = new AuthService();

  createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // const users = await this.usersService.
      const { nickname, email, password } = req.body;

      const createUser = await this.authService.localSignUp(
        nickname,
        email,
        password
      );
      return res.status(200).json({ data: createUser });
    } catch (e) {
      console.error(e);
    }
  };

  loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const user = req.user;

      const loginUser = await this.authService.localSignIn(
        email,
        password,
        user
      );
      console.log(loginUser);
      if (!loginUser) {
        return res.status(400).json({ message: "fail" });
      }
      return res.status(200).json({ message: "ok" });
    } catch (error) {}
  };

  kakaoLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const user = req.user;

      const loginUser = await this.authService.localSignIn(
        email,
        password,
        user
      );
      return res.status(200).json({ message: "ok" });
    } catch (error) {}
  };

  googleLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const user = req.user;

      const loginUser = await this.authService.localSignIn(
        email,
        password,
        user
      );
      return res.status(200).json({ message: "ok" });
    } catch (error) {}
  };
}
