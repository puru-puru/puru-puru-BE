// 어플리케이션의 바깥 부분 , 요청/ 응답을 처리함.
import { AuthService } from "../services/auth.service";
import { EmailUtils } from '../utils/email.utils'
import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import dotenv from "dotenv"

dotenv.config()

// 유효성 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const userSchema = Joi.object({
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] }, // 아래 하단은 도메인 검사 유효성 부분.
  }).custom((value, helpers) => {
    const validDomains = ['gmail.com', 'naver.com', 'daum.net', 'kakao.com', 'nate.com', 'hanmail.com'];
    const domain = value.split('@')[1]; // 알겠지만. @를 기준으로 잘라서
    if (!validDomains.includes(domain)) { // 해당 도메인과 일치 하는지 검사.
      return helpers.error('string.email');
    }
    return value;
  }),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9!@#$%^&*()_+\\-=\\[\\]{};':\",./<>?|\\\\~` ]{5,20}$")),
  confirmPassword: Joi.string().valid(Joi.ref("password"))
  }).options({ abortEarly: false }); 

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export class AuthController {
  authService = new AuthService();
  emailUtils = new EmailUtils();

  // 인증 메일 발송 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  emailVerification = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = await userSchema.validateAsync(req.body) // 바디 값으로 이메일 받음
  
      const isGoogleEmail = email.endsWith('@gmail.com'); // 만약 이메일 부부에 구글이 들어가면. 이라는 조건 달고.
  
      const result = await this.authService.sendEmailAndRegister(email); // 여기서 서비스 부분으로 넘기고 받고.
  
      // 인증 메일 보내기
      // const url = `http://localhost:3000/api/test/auth/verify-email?email=${email}`;
      // await this.emailUtils.sendVerificationEmail(email, url, isGoogleEmail);
  
      // // 배포 환경.
      const url = `https://purupuru.store/api/test/auth/verify-email?email=${email}`; // 유알엘은 여기로.
      await this.emailUtils.sendVerificationEmail(email, url, isGoogleEmail); // 구글이 붙어 있다면 이리로.
  
      return res.status(200).json({ message: "이메일 인증 메일이 발송되었습니다.", data: { result } });
    } catch (err) {
      next(err);
    }
  }

// 이메일 인증 회원가입 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

testsignupUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, confirmPassword } = await userSchema.validateAsync(req.body); // 메일, 비밀번호, 일치하는지.

    // 이메일이 인증되었는지 확인
    const isEmailValid = await this.authService.isEmailValid(email);
    if (!isEmailValid) {
      return res.status(400).json({ message: "이메일이 인증되지 않았습니다." });
    }

    // 회원 가입 
    const signUpUser = await this.authService.testsignupUser(email, password);

    return res.status(200).json({ message: "회원 가입 성공", data: signUpUser });

  } catch (err) {
    next(err);
  };
}


  // 네이버 인증 메일 확인. - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

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

// 구글 이메일 인증 확인  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

verifyGoogleEmail = async (req: Request, res: Response) => {
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
      return res.status(412).json({ message: '이메일이 이미 인증이 완료되었습니다..' });
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
      const { email, password } = req.body; // 바디로 값을 받아서.

      const user: any = req.user;

      const signinUser = await this.authService.signinUser(email, password, user); // 서비스 단으로 넘긴다.

      if (!signinUser) {
        return res.status(400).json({ message: "로그인 실패" });
      }

      const { accessToken, refreshToken, hasNickname } = signinUser; // 서비스에서 받아온 값.

      this.setCookies(res, accessToken, refreshToken);

      return res.status(200).json({ // 여기서 리스폰스 해준다.
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
      const refreshToken = req.headers["refresh"] as string | undefined; // 토큰을 받아.
      // const accessToken = req.headers["authorization"]; 

      if (!refreshToken) {
        throw new Error("토큰 입력이 안되었음.");
      }

      const { newAccessToken, newRefreshToken } = await this.authService.refreshAccessToken(refreshToken); // 서비스 단으로 넘기고 받아옴.

      return res.status(200).json({message: "토큰 재 발급.",data: { newAccessToken, newRefreshToken },}); // 리스폰스
      
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

  // 기존 회원 가입 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  signupUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
          const { email, nickname, password, confirmPassword } =
            await userSchema.validateAsync(req.body); // 받은 값을 조이로 검사.
    
          if (!this.authService.confirmPassword(password, confirmPassword)) {
            throw { name: "PasswordMismatch" };
          } // 서비스 부분에 있는 컨펌 패스워드와 일치 하지 않는다면, 에러.
    
          await this.authService.signupUser(email, nickname, password);
    
          return res.status(200).json({ message: "회원 가입 성공" });
        } catch (err) {
          next(err);
        }
      };
  

  // test - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 


  // 쿠키 부여 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  setCookies = async (res: Response, accessToken: string, refreshToken: string) => {
    res.cookie("refreshToken", `Bearer ${decodeURIComponent(String(refreshToken))}`);
    res.cookie("accessToken", `Bearer ${decodeURIComponent(String(accessToken))}`);
  }
}
