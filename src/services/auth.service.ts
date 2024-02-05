// 어플리케이션의 중간 부분. API 핵심적인 동작(가공) 이 많이 일어남
import { Request, Response, NextFunction } from "express";
import { AuthRepository } from "../repositories/auth.repository";
import { Users } from '../../models/Users'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { any, ref } from "joi";

// type ExpressNextFunction = NextFunction;



const acc: string = process.env.JWT_ACCESS_SECRET_KEY!
const rcc: string = process.env.JWT_REFRESH_SECRET_KEY!
const hash: string = process.env.BCRYPT_SALT!

export class AuthService {
  authRepository = new AuthRepository()

 //회원가입
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

    const signupUser = await this.authRepository.signupUser(
      nickname, // 옵션을 주어서 해도 되고 안해도 되고.
      email,
      hashPassword
    );

    return {
      nickname: signupUser.nickname,
      email: signupUser.email,
      password: signupUser.password,
    };
  } catch(err: any) {
    throw err;
  }
};

  loginUser = async (email: string, password: string, user: any) => {
    try {
      // 사용자가 있는지 확인
      const findUser = await Users.findOne({ where: { email } });
      if (findUser) {
        // 비밀번호 확인
        const checkPassword = await bcrypt.compare(password, findUser.password);
        if (!checkPassword) {
          throw { name: "WorngPassword" };
        }
      } else {
        throw { name: "UserNotFound" };
      }
      // 로그인 할시 토큰을 부여.
      const loginUser = await this.authRepository.loginUser(email, password);
  
      if (loginUser) {
        const accessToken = await this.createAccessToken(loginUser.email);
        const refreshToken = await this.createRefreshToken(loginUser.email);
  
        // 리프레쉬 토큰 디비에 저장시 해쉬화.
        const salt = bcrypt.genSaltSync(parseInt(hash));
        const hashedRefreshToken = bcrypt.hashSync(refreshToken || 'default-token', salt);
        // 여기서 디비로 저장.
  
        await Users.update(
          { hashedRefreshToken },
          { where: { id: loginUser.id } }
        );
  
        // 넘기기.
        return { accessToken, refreshToken };
      } else {
        throw { name: "UserNotFound" };
      }
      // return { loginUser };
    } catch(err: any) {
      throw err;
    }
  };

  // kakaoSignIn = async () => {};

  // googleSignIn = async () => {};


  createAccessToken = async (email: string) =>{
    try{
      const accessToken = jwt.sign(
        { email }, // JWT 데이터
        acc, // Access Token의 비밀 키
        { expiresIn: "5h" } // Access Token이 5h 뒤에 만료되도록 설정.
      );
      return accessToken 
    } catch (err) {
      console.error(err)
    }
}

// 여기서 부터 토큰 옵션 설정 및 발급 해독 하는 곳.

  createRefreshToken = async (email: string) => {
    try{
      const refreshToken = jwt.sign(
        { email }, // JWT 데이터
        rcc, // Refresh Token의 비밀 키
        { expiresIn: "7d" } // Refresh Token이 7일 뒤에 만료되도록 설정.
      );
      return refreshToken
    } catch (err) {
      console.error(err)
    }
  }

  decodedRefreshToken = (refreshToken: string) => {
    try {
      const [tokenType, token] = refreshToken.split(" ");
      return jwt.decode(token, { json: true }) as any;
    } catch (err) {
      console.error(err)
    }
  }

  validateRefreshToken = async (refreshToken:string, hashedRefreshToken:string, res: Response) => {
      try {
          const [tokenType, token] = refreshToken.split(" ");

          if(tokenType !== "Bearer") 
          throw new Error ( " 로그인이 필요한 서비스 입니다. " )

          const checkRefreshToken = await bcrypt.compare(token, hashedRefreshToken);

          if (!checkRefreshToken) {
            return res.status(400).json({ errorMessage: "잘못된 접근입니다. " });
          }
          
          return jwt.verify(token, rcc);
        } catch (err) {
          console.error(err)
        }
  }
}
