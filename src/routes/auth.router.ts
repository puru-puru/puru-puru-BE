import express from "express";
import { AuthController } from "../controllers/auth.controller";
import authMiddleware from "../middlewares/auth.middleware";

const router = express.Router();

const authController = new AuthController();

router.post("/auth/sign-up", authController.signupUser);

router.post('/auth/sign-in', authController.loginUser)

router.post("/auth/sign-out", authMiddleware, authController.logoutUser);

router.post('/auth/kakao/sign-in', authController.loginUser)


// router.post('/auth/google/sign-in', 
// middelware,
// authController.loginUser)

export default router