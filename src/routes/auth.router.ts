import express from "express";
import { AuthController } from "../controllers/auth.controller";

const router = express.Router();

const authController = new AuthController();

// router.post("/auth/sign-up", authController.createUser);

// router.post('/auth/sign-in', authController.loginUser)

// router.post('/auth/kakao/sign-in', authController.loginUser)

// router.post('/auth/google/sign-in', 
//middelware,
// authController.loginUser)

export default router