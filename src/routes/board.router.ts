import express from 'express'
import { BoardController } from '../controllers/board.controller';
import upload from '../../assets/upload';
import authMiddleware  from '../middlewares/auth.middleware'

const router = express.Router()

const boardController = new BoardController();

// 커뮤니티 전체 글 조회 ok
router.get('/boards', boardController.boardList)

// 커뮤니티 글 작성 ok
router.post('/boards', upload.single("image"), authMiddleware, boardController.boardPost)

// 커뮤니티 상세 보기 
router.get('/boards/:boardId', authMiddleware, boardController.boardDetail)

// 커뮤니티 글 수정.
router.patch('/boards/:boardId', authMiddleware, boardController.boardPatch)

// 커뮤니티 글 삭제.
router.delete('/boards/:boardId', authMiddleware, boardController.boardDelete)


export default router