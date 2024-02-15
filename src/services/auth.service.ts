// 어플리케이션의 중간 부분. API 핵심적인 동작(가공) 이 많이 일어남
import { Request, Response, NextFunction } from "express";
import { UserRepository } from "../repositories/user.repository";
import { Users } from "../../models/Users";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import axios from "axios";

const acc: string =
  process.env.JWT_ACCESS_SECRET_KEY || "default_access_secret_key";
const rcc: string =
  process.env.JWT_REFRESH_SECRET_KEY || "default_refresh_secret_key";
const hash: string = process.env.BCRYPT_SALT || "default_salt_key";

export class AuthService {
  userRepository = new UserRepository();

  confirm = (password: string, confirmPassword: string) => {
    return password === confirmPassword;
  };

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

  // 로그인
  signinUser = async (email: string, password: string, user: any) => {
    try {
      // 사용자가 있는지 확인
      const findUser = await this.userRepository.findUser({ where: { email } });

      if (!findUser) {
        throw { name: "UserNotFound" };
        // 비밀번호 확인
      }

      const checkPassword = await bcrypt.compare(password, findUser.password);
      if (!checkPassword) {
        throw { name: "WorngPassword" };
      }

      const accessToken = await this.createAccessToken(findUser.email);
      const refreshToken = await this.createRefreshToken(findUser.email);

      // 리프레쉬 토큰 디비에 저장시 해쉬화.
      const salt = bcrypt.genSaltSync(parseInt(hash));
      const hashedRefreshToken = bcrypt.hashSync(
        refreshToken || "default-token",
        salt
      );
      // 여기서 디비로 저장. <-- 원래 레포계층에서 하려 했으나... ㅠㅠ
      await Users.update(
        { hashedRefreshToken },
        { where: { id: findUser.id } }
      );

      // 넘기기.
      return { accessToken, refreshToken };
    } catch (err: any) {
      throw err;
    }
  };

  // 로그아웃.
  signOut = async (user: any) => {
    try {
      await this.userRepository.updateUser(
        { hashedRefreshToken: null },
        { where: { email: user.email }}
      ); 
    } catch (err: any) {
      throw err;
    }
  };

  // refreshTokens = async (user: any) => {
  //   try {
  //     const refreshToken = req.headers["ref"]
  //   } catch (err) {
      
  //   }
  // }

  // 카카오 로그인
  // kakaoSignIn = async (kakaoToken: any) => {
  //   try {
  //     // Kakao API로부터 유저 정보를 가져옵니다.
  //     const responseUser = await axios.get(
  //       "https://kapi.kakao.com/v2/user/me",
  //       {
  //         headers: {
  //           Authorization: `Bearer ${kakaoToken}`,
  //         },
  //       }
  //     );

  //     // 가져온 이메일로 기존 유저가 있는지 확인합니다.
  //     const existingEmail = await Users.findOne({
  //       where: { email: responseUser.data.kakao_account.email },
  //     });

  //     if (!existingEmail) {
  //       // 기존 유저가 없다면 새로운 유저를 생성합니다.
  //       await this.authRepository.signupUser(
  //         responseUser.data.kakao_account.email,
  //         responseUser.data.properties.nickname,
  //         responseUser.data.id
  //       );
  //     }
  //     // 새로운 AccessToken 및 RefreshToken 생성
  //     const accessToken = await this.createAccessToken(
  //       responseUser.data.kakao_account.email
  //     );
  //     const refreshToken = await this.createRefreshToken(
  //       responseUser.data.kakao_account.email
  //     );

  //     // RefreshToken을 해싱하여 DB에 저장
  //     const salt = bcrypt.genSaltSync(parseInt(hash));
  //     const hashedRefreshToken = bcrypt.hashSync(
  //       refreshToken || "default-token",
  //       salt
  //     );

  //     await Users.update(
  //       { hashedRefreshToken },
  //       { where: { email: responseUser.data.kakao_account.email } }
  //     );

  //     // 성공 응답
  //     return {
  //       message: "카카오 로그인에 성공하였습니다.",
  //       data: { accessToken, refreshToken },
  //     };
  //   } catch (err) {
  //     console.error("Error during Kakao sign-in:", err);
  //     throw err;
  //   }
  // };

  // kakaoSignIn = async ( kakaoToken: any ) => {
  //   try {
  //     const result = await axios.get("https://kapi.kakao.com/v2/user/me", {
  //       headers: {
  //         Authorization: `Bearer ${kakaoToken}`,
  //       }
  //     })
  //     const {data} = result
  //     const email = data.kakao_account.email;

  //     if(!email) throw new Error ("key_error")
  //     const user = await Users.findOne({ where: email })
  //   if(!user){
  //     await user.
  //   }
  //   } catch (error) {
  //   }
  // };

  // googleSignIn = async () => {};

  // 여기서 부터 토큰 옵션 설정 및 발급 해독 하는 곳.

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

  decodedRefreshToken = (refreshToken: string) => {
    try {
      const [tokenType, token] = refreshToken.split(" ");
      return jwt.decode(token, { json: true }) as any;
    } catch (err) {
      throw err;
    }
  };

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
}
