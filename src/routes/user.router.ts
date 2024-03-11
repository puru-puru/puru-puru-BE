import express from 'express'
import { UserController } from '../controllers/user.controller'
import authMiddleware from '../middlewares/auth.middleware'

const router = express.Router()

const userController = new UserController

// 닉네임 설정 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
router.post("/users/set-name", authMiddleware, userController.setName)

// 내 정보 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
router.get('/users', authMiddleware, userController.getUser)

// 회원 탈퇴 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
router.delete('/users/delete-user', authMiddleware, userController.deleteUser)

// 낙내암 변경 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
router.put('/users/change-name', authMiddleware, userController.changeName)

export default router