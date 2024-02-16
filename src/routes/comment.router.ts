import express from 'express'
// import express, { Request, Response } from 'express'; // TS에서 ES6문법으로 작성할 때 이와 같이 작성함.
import { CommentController } from '../controllers/comment.controller';
import authMiddleware  from '../middlewares/auth.middleware'

const router = express.Router()

const commentController = new CommentController();

// 커뮤니티 작성된 게시글에 댓글 목록 조회
router.get('/boards/:boardId', authMiddleware, commentController.commentList)

// 커뮤니티 작성된 게시글에 댓글 달기
router.post('/boards/:boardId/comments', authMiddleware, commentController.commentPost)

// 커뮤니티 작성된 게시글의 댓글 수정하기
router.patch('/boards/:boardId/comments/:commentsId', authMiddleware, commentController.commentPatch)

// 커뮤니티 작성된 게시글의 댓글 삭제하기
router.delete('/boards/:boardId/comments/:commentsId', authMiddleware, commentController.commentDelete)


export default router