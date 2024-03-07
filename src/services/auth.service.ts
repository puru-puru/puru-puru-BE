// 어플리케이션의 중간 부분. API 핵심적인 동작(가공) 이 많이 일어남
import { Request, Response, NextFunction } from "express";
import { UserRepository } from "../repositories/user.repository";
import { Users } from "../../models/Users";
import { EmailUtils } from '../utils/email.utils'
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv"

dotenv.config()

const acc: string = process.env.JWT_ACCESS_SECRET_KEY || "default_access_secret_key";
const rcc: string = process.env.JWT_REFRESH_SECRET_KEY || "default_refresh_secret_key";
const hash: string = process.env.BCRYPT_SALT || "default_salt_key";

export class AuthService {
  userRepository = new UserRepository();
  emailUtils = new EmailUtils();

  // 비밀번호 확인 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  confirmPassword = (password: string, confirmPassword: string) => {
    return password === confirmPassword;
  };

  //테스트 회원가입 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  testsignupUser = async (email: string, password: string) => {
    try {
      // 우선 에러 처리.
      if (!email || !password) {
        throw { name: "ValidationError" };
      }
  
      // 여기서 검증 부분을 처리 해야 하기에.. 디비 안에 있는 거 여기서 꺼내옴.
      const isExistUser = await Users.findOne({
        where: { email, isEmailValid: true },
      });
  
      if (!isExistUser) {
        throw { name: "NotExistValidUser" };
      }
  
      // 이후 에러 뚫고 오면 비밀 번호 해쉬화.
      const salt = bcrypt.genSaltSync(parseInt(hash));
      const hashPassword = bcrypt.hashSync(password, salt);
  
      await Users.update(
        { password: hashPassword },
        { where: { email, isEmailValid: true } }
      );
  
      // return 
    } catch (err: any) {
      throw err;
    };
  }
  

  // 로그인 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  signinUser = async (email: string, password: string, user: any) => {
    try {
      // 사용자가 있는지 확인
      const findUser = await this.userRepository.findUser({ where: { email } });

      if (!findUser) {
        throw { name: "UserNotFound" };
      }

      const hasNickname = findUser.nickname !== null; // 프론트에게 전달 해줄 닉네임 값.

      const checkPassword = await bcrypt.compare(password, findUser.password); // 비밀번호 일치 하는지 검사.
      if (!checkPassword) {
        throw { name: "WorngPassword" };
      }

      // 토큰 부여
      const accessToken = await this.createAccessToken(findUser.email);
      const refreshToken = await this.createRefreshToken(findUser.email);

      // 리프레쉬 토큰 디비에 저장시 해쉬화.
      const salt = bcrypt.genSaltSync(parseInt(hash));
      const hashedRefreshToken = bcrypt.hashSync(
        refreshToken || "default-token",
        salt
      );
      
      await Users.update(
        { hashedRefreshToken },
        { where: { userId: findUser.userId } }
      );

      // 넘기기
      return { accessToken, refreshToken, hasNickname };
    } catch (err: any) {
      throw err;
    }
  };

  // 로그아웃. - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  signOut = async (user: any) => {
    try {
      await this.userRepository.updateUser( // 로그아웃 요청이 오면 리프레쉬 토큰을 null 값으로 바꾼다.
        { hashedRefreshToken: null },
        { where: { email: user.email }}
      ); 
    } catch (err: any) {
      throw err;
    }
  };

  // 토큰 재 발급. - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  refreshAccessToken = async (refreshToken: string) => {
    try {
      const decodedInfo = this.decodedAccessToken(refreshToken); // 하단에 토큰을 디코드 하는 함수.
  
      const user = await Users.findOne({ // 디코드 했을때 
        where: { email: decodedInfo.email },
      });
      if (!user) { // 없으면 에러 처리
        throw new Error("유저 정보가 없습니다.");
      }
  
      const verifyRefreshToken = await this.validateRefreshToken( // 유효 한지 검사 하고. 하단으로 에러처리 뚫고 가면
        refreshToken,
        user.hashedRefreshToken,
      );
      if (verifyRefreshToken === "invalid token") {
        await Users.update(
          { hashedRefreshToken: null },
          { where: { email: user.email } }
        );
        throw new Error("토큰 인증 실패");
      }
  
      if (verifyRefreshToken === "jwt expired") {
        await Users.update(
          { hashedRefreshToken: null },
          { where: { email: user.email } }
        );
        throw new Error("로그인이 필요한 서비스입니다.");
      }
  
      const newAccessToken = await this.createAccessToken(user.email); // 새로은 토큰 부여.
      const newRefreshToken = await this.createRefreshToken(user.email);
  
      const salt = bcrypt.genSaltSync(parseInt(hash));
      const hashedRefreshToken = bcrypt.hashSync(
        newRefreshToken || "default-token",
        salt
      );
      await Users.update({ hashedRefreshToken }, { where: { userId: user.userId } });
  
      return { newAccessToken, newRefreshToken };
    } catch (err) {
      throw err;
    }
  }

  // 동의 약관 처리 부분.. 아직 테스트 진행 해보지 모했음. - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

  agreedService = async (userId: any, agreedService: boolean) => {
    try {
      await this.userRepository.agreedService(userId, agreedService)
    } catch (err) {
      throw err;
    }
  }

  // 이메일 관련  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  // 이메일 값 찾기
   findUserByEmail = async (email: string) => {
    try {
      const user = await this.userRepository.findUser({ where: { email } });
      return user;
    } catch (err) {
      throw err;
    }
  }

  // 해당 이메일을 검증된 이메일로 바꾸어쥬ㅜㅁ
  updateUserEmailVerification = async (email: string) => {
    try {
      await this.userRepository.updateUser({ isEmailValid: true, sendeMailed: true }, { where: { email } });
    } catch (err) {
      throw err;
    }
  }

  // 이메일 인증을 보냄과 동시에 해당 이메일을 디비에 저장.....
  sendEmailAndRegister = async (email: string) => {
    try {
        const isExistUser = await Users.findOne({
          where: { email }
        })
        if (isExistUser) {
          throw { name : "ExistUser"}
        }
        const userInstance = Users.build({
          email,
        });

        await userInstance.save();

        return {sendEmailAndRegister : userInstance }
    } catch (err) {
      throw err;
    }
  }
  // 이메일이 인증된 이메일 인지 확인.
  isEmailValid = async (email: string ) => {
    try {
      const user = await this.userRepository.findUser({ where: { email } });
  
      if (!user) {
        // 사용자를 찾을 수 없음
        return false;
      }
  
      // 이메일이 확인되었는지 확인합니다.
      return user.isEmailValid || false;
  
    } catch (err) {
      throw err;
    }
  }

  // 기존 회원가입 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  signupUser = async (email: string, nickname: string, password: string) => {
        try {
          // 우선 에러 처리.
          if (!email || !password) {
            throw { name: "ValidationError" };
          }
          // 여기서 검증 부분을 처리 해야 하기에.. 디비 안에 있는거 여기서 꺼내옴.
          const isExistUser = await Users.findOne({
            where: { email },
          });
    
          if (isExistUser) {
            throw { name: "ExistUser" };
          }
          // 이후 에러 뚫고 오면 비밀 번호 해쉬화.
          const salt = bcrypt.genSaltSync(parseInt(hash));
          const hashPassword = bcrypt.hashSync(password, salt);
    
          const signupUser = await this.userRepository.createUser({
            email,
            nickname,
            password: hashPassword,
          });
    
          return {
            signupUser,
          };
        } catch (err: any) {
          throw err;
        }
      };


  // 여기서 부터 토큰 옵션 설정 및 발급 해독 하는 곳 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

  // 쿠키 부여.
  setCookies = async (res: Response, accessToken: string, refreshToken: string) => {
    res.cookie("refreshToken", `Bearer ${decodeURIComponent(String(refreshToken))}`);
    res.cookie("accessToken", `Bearer ${decodeURIComponent(String(accessToken))}`);
  }

  // 토큰 값 해독.
  decodedAccessToken = (accessToken: string) => {
    try {
      const [tokenType, token] = accessToken.split(" ");
      return jwt.decode(token, { json: true }) as any;
    } catch (err) {
      throw err;
    }
  };

  // 토큰이 유효한지 검사 하는 곳.
  validateRefreshToken = async (refreshToken: string,hashedRefreshToken: string,) => {
    try {
      const [tokenType, token] = refreshToken.split(" ");

      if (tokenType !== "Bearer")
        throw new Error(" 로그인이 필요한 서비스 입니다. ");

      const checkRefreshToken = await bcrypt.compare(token, hashedRefreshToken);

      console.log('checkRefreshToken:', checkRefreshToken);

      if (!checkRefreshToken) {
        throw new Error("잘못된 접근입니다.");
      }

      return jwt.verify(token, rcc);
    } catch (err) {
      throw err;
    }
  };

  // 엑세스 토큰 만들기.
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

  // 리프레쉬 토큰 만들기.
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