// 어플리케이션의 바깥 부분 , 요청/ 응답을 처리함.
import { AuthService } from "../services/auth.service";
import { EmailUtils } from '../utils/email.utils'
import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import dotenv from "dotenv"
import { Users } from "../../models/Users";
import axios from "axios";


dotenv.config()

// 유효성 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const userSchema = Joi.object({
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }).custom((value, helpers) => {
    const validDomains = ['gmail.com', 'naver.com', 'daum.net', 'kakao.com', 'nate.com', 'hanmail.com'];
    const domain = value.split('@')[1];

    if (!validDomains.includes(domain)) {
      return helpers.error('string.email');
    }

    return value;
  }),
  nickname: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{5,15}$")),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9!@#$%^&*()_+\\-=\\[\\]{};':\",./<>?|\\\\ ]{5,20}$")).required(),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required()
  }).options({ abortEarly: false }); 

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export class AuthController {
  authService = new AuthService();
  emailUtils = new EmailUtils();

// 회원가입 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
signupUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, nickname, password, confirmPassword } = await userSchema.validateAsync(req.body);

    const signUpUser = await this.authService.signupUser(email, nickname, password);

    // 이메일 보내기
    const url = `http://localhost:3000/api/auth/verify-email?email=${email}`;
    await this.emailUtils.sendVerificationEmail(email, url);

    return res.status(200).json({ message: "회원 가입 성공", data: signUpUser });

  } catch (err) {
    next(err);
  };
}
// 이메일 유효 한지 확인 하는 부분 !!!
verifyEmail = async (req: Request, res: Response) => {
  try {
    
    const email: string = req.query.email as string;

    if (!email) {
      return res.status(412).json({ message: '데이터 형식이 올바르지 않습니다.' });
    }

    const emailValid = await this.authService.findUserByEmail(email);

    if (!emailValid) {
      return res.status(412).json({ message: '이메일 인증이 되지 않았습니다.' });
    }

    if (emailValid.isEmailValid) {
      return res.status(412).json({ message: '이메일이 이미 인증이 완료 되었습니다..' });
    }

    await this.authService.updateUserEmailVerification(email);

    return res.status(200).json({ message: '이메일 인증 완료' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: '서버 에러..' });
  }
};

  // 로그인 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  signinUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      const user: any = req.user;

      const signinUser = await this.authService.signinUser(email, password, user);

      if (!signinUser) {
        return res.status(400).json({ message: "로그인 실패" });
      }

      const { accessToken, refreshToken, hasNickname } = signinUser;

      this.setCookies(res, accessToken, refreshToken);

      return res.status(200).json({
        message: "로그인 성공",
        data: { accessToken, refreshToken, hasNickname },
      });

    } catch (err) {
      next(err);
    }
  };

  // 로그아웃 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  signOut = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user: any = req.user;

      if (!req.user) throw { name: "UserNotFound" };

      await this.authService.signOut(user);

      return res.status(200).json({ message: "로그아웃 성공" });

    } catch (err) {
      next(err);
    }
  };

  // 토큰 재 발급 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  getRefresh = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refreshToken = req.headers["refresh"] as string | undefined;
      // const accessToken = req.headers["authorization"]; 

      if (!refreshToken) {
        throw new Error("토큰 입력이 안되었음.");
      }

      const { newAccessToken, newRefreshToken } = await this.authService.refreshAccessToken(refreshToken);

      return res.status(200).json({message: "토큰 재 발급.",data: { newAccessToken, newRefreshToken },});
      
    } catch (err) {
      next(err);
    }
  };


  // 사용자 약관 동의 부분인데 아직 잘 모르겠음.. - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  agreedService = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user: any = req.user;
      const { agreedService } = req.body;

      if( agreedService === undefined ) {
        return res.status(400).json({ message: " 약관 동의 부탁. " })
      }
      await this.authService.agreedService(user.userId, agreedService);

      return res.status(200).json({ message: "이용 동의 업데이트 완료." })
    } catch (err) {
      next(err)
    }
  }

  // test - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  // console.log("hello World!")

  // test - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 


  // 쿠키 부여 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  setCookies = async (res: Response, accessToken: string, refreshToken: string) => {
    res.cookie("refreshToken", `Bearer ${decodeURIComponent(String(refreshToken))}`);
    res.cookie("accessToken", `Bearer ${decodeURIComponent(String(accessToken))}`);
  }
}
