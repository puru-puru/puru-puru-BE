// 어플리케이션의 중간 부분. API 핵심적인 동작이 많이 일어남
import { User } from "../types/customtype/express";
import { UsersService } from "./users.service";

export class AuthService {
  usersService = new UsersService();
  // usersRepository = new UsersRepository()

  localSignUp = async (nickname: string, email: string, password: string) => {
    const createUser = await this.usersService.createUser(
      nickname,
      email,
      password
    );
    return {
      nickname: createUser.nickname,
      email: createUser.email,
      password: createUser.password,
    };
  };

  localSignIn = async (nickname: string, password: string, user: any) => {
    const loginUser = await this.usersService.getUser(nickname, password);

    console.log(loginUser);
    // 검증
    if (!loginUser) {
      return null;
    }
    return {
      loginUser,
    };
  };

  kakaoSignIn = async () => {};

  googleSignIn = async () => {};

  // createAccessToken = async (username:string) => {
  //     const accessToken = jwt.sign(
  //         { username }, // JWT 데이터
  //         process.env.JWT_ACCESS_SECRET_KEY, // Access Token의 비밀 키
  //         { expiresIn: "1h" } // Access Token이 10초 뒤에 만료되도록 설정.
  //       );

  //       return accessToken;

  // }

  // createRefreshToken = async (username: string) => {
  //     const refreshToken = jwt.sign(
  //         { username }, // JWT 데이터
  //         process.env.JWT_REFRESH_SECRET_KEY, // Refresh Token의 비밀 키
  //         { expiresIn: "7d" } // Refresh Token이 7일 뒤에 만료되도록 설정.
  //       );

  //       return refreshToken;
  // }

  // validateRefreshToken= async (refreshToken:string, hashedRefreshToken:string ) {
  //     try {
  //         const [tokenType, token] = refreshToken.split(" ");

  //         if (tokenType !== "Bearer")
  //           throw new Error(" 로그인이 필요한 서비스 입니다. ");

  //         const checkRefreshToken = await bcrypt.compare(token, hashedRefreshToken);

  //         if (!checkRefreshToken) {
  //         //   return res.status(400).json({ errorMessage: "잘못된 접근입니다. " });
  //         }
  //         return jwt.verify(token, process.env.JWT_REFRESH_SECRET_KEY);
  //       } catch (error) {
  //         return error
  //       }
  // }
}
