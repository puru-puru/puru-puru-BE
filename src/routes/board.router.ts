import express from 'express'
import { BoardController } from '../controllers/board.controller';
import authMiddleware  from '../middlewares/auth.middleware'

const router = express.Router()

const boardController = new BoardController();

// 커뮤니티 전체 글 조회
router.get('/boards', boardController.boardList)

// 커뮤니티 글 작성
router.post('/boards', authMiddleware, boardController.boardPost)

// 커뮤니티 상세 보기
// router.get('/boards/:boardId', authMiddleware, boardController.boardDetail)

// // 커뮤니티 글 수정.
// router.patch('/boards/:boardId', authMiddleware, boardController.boardPetch)

// // 커뮤니티 글 삭제.
// router.delete('/boards/:boardId', authMiddleware, boardController.boardDelete)


export default router
