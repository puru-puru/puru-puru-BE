import express from 'express'
// import express, { Request, Response } from 'express'; // TS에서 ES6문법으로 작성할 때 이와 같이 작성함.
import { CommentController } from '../controllers/comment.controller';
import authMiddleware  from '../middlewares/auth.middleware'

const router = express.Router()

const commentController = new CommentController();


// 해당 글에 댓글 작성 
router.post('/boards/:boardId/comments', authMiddleware, commentController.postComment)

// 해당 글에 있는 댓글 수정
router.patch('/boards/:boardId/comments/:commentId', authMiddleware, commentController.updateComment)

// 해당 글의 댓글 삭제
router.patch('/boards/:boardId/comments/:commentId/delete', authMiddleware, commentController.deleteComment)

// 해당 글의 댓글의 대댓글
router.post('/boards/:boardId/comments/:commentId/childCommentIds', authMiddleware, commentController.postComment2)



export default router