import express from "express";
import { AuthController } from "../controllers/auth.controller";
import authMiddleware from "../middlewares/auth.middleware";
import passport, { authenticate } from "passport";

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
// 사용자의 요청을 받아 카카오 서버로 인증 요청을 하는 API
// 1. 외부로 부터 카카오 로그인 요청이 백엔드 서버로 온다.
// 2. 해당하는 라우터의 passport.authenticate("kakao") 를 통해 카카오 로그인 페이지로 이동
// 3. 로그인 진행 -> 카카오 서버는 인증 절차를 처리. (req.login()) 에 해당하는 처리도 카카오 서버에서 처리

// 4. 밑 경로로 인증 정보를 전달. 
// 5. 이 라우터는 카카오 전략을 실행한다. (스트레지 부분으로 이동)
// 카카오 서버가 인증을 완료 한 뒤 인증 결과를 보내는 리다이렉트 URI API
// 소셜 로그인 후의 처리
router.get('/auth/login/kakao/return', passport.authenticate('kakao', {
      failureRedirect: '/',
    }),
    (req, res) => {
      const token = req.user
      const query = "?token=" + token;
      res.locals.token = token;
      res.redirect('/http://localhost:5173')
    }
);

router.get("/auth/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      console.error(err);
      return res.redirect("/"); // 로그아웃 중 에러가 발생한 경우에 대한 처리
    }
    res.redirect("http://localhost:3000/"); // 로그아웃 성공 시 리다이렉트
  });
});


export default router;
