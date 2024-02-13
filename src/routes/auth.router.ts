import express from "express";
import { AuthController } from "../controllers/auth.controller";
import authMiddleware from "../middlewares/auth.middleware";
import { RefreshRequest } from "../types/types";

const router = express.Router();

const authController = new AuthController();

// 회원 가입
router.post("/auth/sign-up", authController.signupUser);

// 회원 로그인
router.post("/auth/sign-in", authController.signinUser);

// 회원 로그아웃
router.post("/auth/sign-out", authMiddleware, authController.signOut);

// 리프레쉬 토큰 재 발급
router.get("/refresh", authController.getRefresh);

// 아직 미 구혀어어언...
router.post("/auth/kakao/sign-in", authController.signinUser);

// router.post('/auth/google/sign-in',
// middelware,
// authController.loginUser)

export default router;
