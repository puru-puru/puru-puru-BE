// 어플리케이션의 중간 부분. API 핵심적인 동작(가공) 이 많이 일어남
import { Request, Response, NextFunction } from "express";
// import { User } from "../types/customtype/express";
import { AuthRepository } from "../repositories/auth.repository";
import { Users } from '../../models/Users'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

let acc: string = process.env.JWT_ACCESS_SECRET_KEY as string
let rcc: string = process.env.JWT_REFRESH_SECRET_KEY as string
let hash: string = process.env.BCRYPT_SALT as string

export class AuthService {
  authRepository = new AuthRepository()

  // 회원 가입.
  signupUser = async (nickname: string, email: string, password: string, next: NextFunction) => {
    try {
        // 우선 에러 처리.
      if (!email || !password) throw { name: "ValidationError" };
      // 여기서 검증 부분을 처리 해야 하기에.. 디비 안에 있는거 여기서 꺼내옴.
      const isExistUser = await Users.findOne({
        where: { email },
      });
      if(isExistUser) throw { name: "ExistUser" }
      
      // 이후 에러 뚫고 오면 비밀 번호 해쉬화.
      const salt = bcrypt.genSaltSync(parseInt(hash))
      const hashPassword = bcrypt.hashSync(password, salt)
      
      const signupUser = await this.authRepository.signupUser(
        nickname, // 옵션을 주어서 해도 되고 안해도 되고.
        email,
        hashPassword
      );
      return {
        nickname: signupUser.nickname,
        email: signupUser.email,
        password: signupUser.password
      };
    } catch (err) {
      next(err)
    }
  };

  // 로그인.
  loginUser = async (email: string, password: string, user: any, res: Response, next: NextFunction) => {
    try{
      if (!email || !password) throw { name: "ValidationError" };
      const findUser = await Users.findOne({ where: { email } })
      if (findUser) {
        const checkPassword = bcrypt.compare(password, findUser.password)
        if(!checkPassword) throw { name: "WorngPassword" }
      } else throw { name: "UserNotFound" }

      const loginUser = await this.authRepository.loginUser(email, password)
      if(loginUser) {
        const accessToken = this.createAccessToken(loginUser.email);
        const refreshToken = this.createRefreshToken(loginUser.email);

        const salt = bcrypt.genSaltSync(parseInt(hash))
        const hashedRefreshToken = bcrypt.hashSync(await refreshToken, salt)
        
        // await Users.create({ id: loginUser.id })


        res.cookie("accessToken", decodeURIComponent(await accessToken));
        res.cookie("refreshToken",decodeURIComponent(await refreshToken));
        
      } else throw { name: "UserNotFound" }
      return { loginUser };
    } catch (err) {
      next(err)
    }
  };

  // kakaoSignIn = async () => {};

  // googleSignIn = async () => {};

  createAccessToken = async (email: string) => {
    const accessToken = jwt.sign(
        { email }, // JWT 데이터
        acc, // Access Token의 비밀 키
        { expiresIn: "5h" } // Access Token이 5h 뒤에 만료되도록 설정.
      );
      console.log(acc)
      return accessToken;
}

  createRefreshToken = async (email: string) => {
      const refreshToken = jwt.sign(
          { email }, // JWT 데이터
          rcc, // Refresh Token의 비밀 키
          { expiresIn: "7d" } // Refresh Token이 7일 뒤에 만료되도록 설정.
        );
        return refreshToken;
  }

  // validateRefreshToken= async (refreshToken:string, hashedRefreshToken:string ) {
  //     try {
  //         const [tokenType, token] = refreshToken.split(" ");

  //         // const checkRefreshToken = await bcrypt.compare(token, hashedRefreshToken);

  //         if (!checkRefreshToken) {
  //         //   return res.status(400).json({ errorMessage: "잘못된 접근입니다. " });
  //         }
  //         return jwt.verify(token, rcc);
  //       } catch (error) {
  //         return error
  //       }
  // }
}
