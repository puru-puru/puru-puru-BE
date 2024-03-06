import express from "express";
import { Request, Response, NextFunction } from "express";
import { AuthController } from "../controllers/auth.controller";
import authMiddleware from "../middlewares/auth.middleware";

const router = express.Router();

const authController = new AuthController();

// 기존 회원 가입
router.post("/auth/sign-up", authController.signupUser);

// 테스트 회원 가입
router.post("/test/auth/sign-up", authController.testsignupUser);

// 이메일 전송 및 해당 이메일 디비에 추가.
router.post("/test/auth/send-email", authController.emailVerification);

// 네이버 이메일 인증 부분 처리
router.post("/test/auth/verify-email", authController.verifyEmail);

// 구글 이메일 인증 부분 처리
router
    .route("/test/auth/verify-email")
    .get(authController.verifyEmail)
    .post(async (req, res, next) => {
        try {
            const email = req.body.email as string | undefined;
            // 여기서 구글 이메일 인지 확인.
            const isGoogleEmail = email && email.endsWith("@gmail.com");

            if (isGoogleEmail) {
                // 구글이면 이메일이면 구글 이메일 처리 로직 으로
                return await authController.verifyGoogleEmail(req, res);
            } else {
                // 구글 이메일이 아니면 일반 이메일 처리 로직 수행 하게끔
                return await authController.verifyEmail(req, res);
            }
        } catch (err) {
            next(err);
        }
    });

// 회원 로그인
router.post("/auth/sign-in", authController.signinUser);

// 회원 로그아웃
router.post("/auth/sign-out", authMiddleware, authController.signOut);

// 토큰 재 발급
router.get("/refresh", authController.getRefresh);

// 회원 약관 동의
router.post("/auth/services", authMiddleware, authController.agreedService);

export default router;
