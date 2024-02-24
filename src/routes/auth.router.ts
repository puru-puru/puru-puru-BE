import express from "express";
import { Request, Response, NextFunction } from "express";
import { AuthController } from "../controllers/auth.controller";
import { Users } from "../../models/Users";
import authMiddleware from "../middlewares/auth.middleware";
import passport, { authenticate } from "passport";
import bcrypt from "bcrypt";
import dotenv from 'dotenv'
import jwt from "jsonwebtoken";

dotenv.config()

const router = express.Router();

const acc: string = process.env.JWT_ACCESS_SECRET_KEY || "default_access_secret_key";
const rcc: string = process.env.JWT_REFRESH_SECRET_KEY || "default_refresh_secret_key";
const hash: string = process.env.BCRYPT_SALT || "default_salt_key";

const authController = new AuthController();

// 회원 가입
router.post("/auth/sign-up", authController.signupUser);

// 회원 로그인
router.post("/auth/sign-in", authController.signinUser);

// 회원 로그아웃
router.post("/auth/sign-out", authMiddleware, authController.signOut);

// 토큰 재 발급
router.get("/refresh", authController.getRefresh);

// 회원 약관 동의 
router.post("/auth/services", authMiddleware, authController.agreedService)


// // 카카오 소셜 로그인.
// router.get("/auth/login/kakao", passport.authenticate("kakao"));
// // 사용자의 요청을 받아 카카오 서버로 인증 요청을 하는 API
// // 1. 외부로 부터 카카오 로그인 요청이 백엔드 서버로 온다.
// // 2. 해당하는 라우터의 passport.authenticate("kakao") 를 통해 카카오 로그인 페이지로 이동
// // 3. 로그인 진행 -> 카카오 서버는 인증 절차를 처리. (req.login()) 에 해당하는 처리도 카카오 서버에서 처리

// // 4. 밑 경로로 인증 정보를 전달. 
// // 5. 이 라우터는 카카오 전략을 실행한다. 
// // 카카오 서버가 인증을 완료 한 뒤 인증 결과를 보내는 리다이렉트 URI API
// // 소셜 로그인 후의 처리
// router.get('/auth/login/kakao/return', passport.authenticate('kakao', {
//   failureRedirect: '/',
// }),
// async (req: Request, res: Response) => {
//   try {
//     // 여기서 Passport에서 전달한 사용자 정보를 가져옴
//     const user = req.user as Users | undefined;

//     // 사용자 정보가 존재하는지 확인
//     if (user) {
//       // Token 클래스의 인스턴스 생성
//       const tokenInstance = new Token();

//       // 사용자 정보를 이용하여 토큰을 생성
//       const accessToken = await tokenInstance.createAccessToken(user.email);
//       const refreshToken = await tokenInstance.createRefreshToken(user.email);

//       // 여기에서 Passport에서 전달한 응답 데이터를 사용할 수 있음
//       // const { hashedRefreshToken } = user;

//       // 프론트엔드에 토큰을 포함한 응답을 보냄
//       res.status(200).json({
//         message: '로그인 성공',
//         data: {
//           accessToken,
//           refreshToken: refreshToken,
//           hasNickname: !!user.nickname, // nickname이 존재하는지 여부
//         },
//       });
//     } else {
//       // 사용자 정보가 없을 경우 에러 처리
//       res.status(404).json({ message: '사용자 정보를 찾을 수 없습니다.' });
//     }
//   } catch (error) {
//     // 오류 처리
//     console.error(error);
//     res.status(500).json({ message: '서버 오류' });
//   }
// });

//   // 소셜 로그인 때문에 앞으로 끌어옴 토큰 부분
//   class Token {
//   setCookies = async (res: Response, accessToken: string, refreshToken: string) => {
//     res.cookie("refreshToken", `Bearer ${decodeURIComponent(String(refreshToken))}`);
//     res.cookie("accessToken", `Bearer ${decodeURIComponent(String(accessToken))}`);
//   }


//   decodedAccessToken = (accessToken: string) => {
//     try {
//       const [tokenType, token] = accessToken.split(" ");
//       return jwt.decode(token, { json: true }) as any;
//     } catch (err) {
//       throw err;
//     }
//   };

//   validateRefreshToken = async (refreshToken: string, hashedRefreshToken: string) => {
//     try {
//       const [tokenType, token] = refreshToken.split(" ");

//       if (tokenType !== "Bearer")
//         throw new Error("로그인이 필요한 서비스입니다.");

//       const checkRefreshToken = await bcrypt.compare(token, hashedRefreshToken);

//       if (!checkRefreshToken) {
//         throw new Error("잘못된 접근입니다.");
//       }

//       return jwt.verify(token, rcc);
//     } catch (err) {
//       throw err;
//     }
//   };

//   createAccessToken = async (user: any) => {
//     try {
//       const accessToken = jwt.sign(
//         { email: user.email },  // JWT 데이터
//         acc, // Access Token의 비밀 키
//         { expiresIn: "5h" } // Access Token이 5h 뒤에 만료되도록 설정.
//       );
//       return accessToken;
//     } catch (err) {
//       throw err;
//     }
//   };

//   createRefreshToken = async (email: string) => {
//     try {
//       const refreshToken = jwt.sign(
//         { email }, // JWT 데이터
//         rcc, // Refresh Token의 비밀 키
//         { expiresIn: "7d" } // Refresh Token이 7일 뒤에 만료되도록 설정.
//       );
//       return refreshToken;
//     } catch (err) {
//       throw err;
//     }
//   };
// }

export default router;
