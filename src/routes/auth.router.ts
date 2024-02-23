import express from "express";
import { AuthController } from "../controllers/auth.controller";
import authMiddleware from "../middlewares/auth.middleware";
import passport from "passport";

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

// 카카오 소셜 로그인.
router.get("/auth/login/kakao", passport.authenticate("kakao"));

// 소셜 로그인 후의 처리
router.get(
    "/auth/login/kakao/return", 
    passport.authenticate("kakao", { failureRedirect: "/api/login/failure" }),
    function (req, res) {
      if (req.user) {
        req.logIn(req.user, function(err) {
          if (err) {
            console.error(err);
            return res.redirect("/api/login/failure");
          }
          return res.redirect("/");
        });
      } else {
        console.error("User not found");
        return res.redirect("/api/login/failure");
      }
    }
  );
  

export default router;
