import express from 'express'
import { UserController } from '../controllers/user.controller'
import authMiddleware from '../middlewares/auth.middleware'

const router = express.Router()

const userController = new UserController

// 닉네임 설정.
router.post("/users/set-neame", authMiddleware, userController.setName)

export default router