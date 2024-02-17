import express from 'express'
import { BoardController } from '../controllers/board.controller';
import upload from '../../assets/upload';
import authMiddleware  from '../middlewares/auth.middleware'

const router = express.Router()

const boardController = new BoardController();

// 커뮤니티 전체조회. ( 로그인한 사용자의 닉네임 또한 불러 올 수 있어야 함. )
router.get('/boards', authMiddleware, boardController.boardList)

// 커뮤니티 글 작성 ok
router.post('/boards', upload.single("image"), authMiddleware, boardController.boardPost)

// 커뮤니티 상세 보기 
router.get('/boards/:boardId', authMiddleware, boardController.boardDetail)

// 커뮤니티 글 수정.
router.patch('/boards/:boardId', authMiddleware, boardController.boardPatch)

// 커뮤니티 글 삭제.
router.delete('/boards/:boardId', authMiddleware, boardController.boardDelete)


export default router