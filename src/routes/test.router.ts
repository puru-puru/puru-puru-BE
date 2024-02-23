import express from 'express'
import { TestController } from '../controllers/test.controller';
import authMiddleware  from '../middlewares/auth.middleware'

const router = express.Router()

const testController = new TestController();

// 테스트 화면
router.get('/test', authMiddleware, testController.getNickName)

// 테스트 결과
router.get('/test-result', authMiddleware, testController.getTestResult)



export default router
