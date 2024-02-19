import express from 'express'
import { MainController } from '../controllers/main.controller';
import authMiddleware  from '../middlewares/auth.middleware'

const router = express.Router()

const mainController = new MainController();

// 테스트 화면
router.get('/main', mainController.getInfo)

export default router