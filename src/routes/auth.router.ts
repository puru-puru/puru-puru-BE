import express from "express";
import { AuthController } from "../controllers/auth.controller";
import authMiddleware from "../middlewares/auth.middleware";

const router = express.Router();

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

// 이메일 인증 부분 처리 
router.post("/auth/verify-email", authController.verifyEmail);


export default router;
