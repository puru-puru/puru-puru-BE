import express from 'express'
// import express, { Request, Response } from 'express'; // TS에서 ES6문법으로 작성할 때 이와 같이 작성함.
import { BoardController } from '../controllers/board.controller';
import authMiddleware  from '../middlewares/auth.middleware'

const router = express.Router()

const boardController = new BoardController();

// 커뮤니티 전체 글 조회
router.get('/boards', boardController.boardList)

// 커뮤니티 글 작성
router.post('/boards', authMiddleware, boardController.boardPost)

// 커뮤니티 상세 보기
router.get('/boards/:boardId', authMiddleware, boardController.boardDetail)

// // 커뮤니티 글 수정.
router.patch('/boards/:boardId', authMiddleware, boardController.boardPatch)

// // 커뮤니티 글 삭제.
// router.delete('/boards/:boardId', authMiddleware, boardController.boardDelete)


export default router

    