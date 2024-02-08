import express from 'express'
import { TestController } from '../controllers/test.controller';
import authMiddleware  from '../middlewares/auth.middleware'

const router = express.Router()

const testController = new TestController();

// 커뮤니티 전체 글 조회
router.get('/test', authMiddleware, testController.getNickName)

// 커뮤니티 글 작성
router.post('/test', authMiddleware, testController.getTestResult)



export default router
