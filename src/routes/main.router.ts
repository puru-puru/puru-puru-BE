import express from 'express'
import { MainController } from '../controllers/main.controller';
import authMiddleware  from '../middlewares/auth.middleware'

const router = express.Router()

const mainController = new MainController();

// 메인 화면을 호출하는 라우트이다 => 자세한 내용은 서비스 계층에서
router.get('/main', authMiddleware, mainController.getInfo)

export default router