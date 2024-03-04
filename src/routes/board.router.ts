import express from 'express'
import { BoardController } from '../controllers/board.controller';
import upload from '../../assets/upload';
import authMiddleware  from '../middlewares/auth.middleware'
import { LikeController } from '../controllers/like.controller';

const router = express.Router()

const boardController = new BoardController();
const likeController = new LikeController();

// 커뮤니티 전체조회. 사실상 메인 페이지 임. ok 
router.get('/boards', authMiddleware, boardController.boardList)

// 게시물 인기순으로 불러오기
router.get('/boards/sortBy/likes', authMiddleware, boardController.boardListPopular)

// 커뮤니티 내가 작성한 글 불러오기
router.get('/boards/myposts', authMiddleware, boardController.boardMyPostsList)

// 커뮤니티 내가 작성한 댓글 불러오기
router.get('/boards/mycomments', authMiddleware, boardController.boardMyCommentsList)

// 커뮤니티 글 작성 ok
router.post('/boards', upload.single("image"), authMiddleware, boardController.boardPost)

// 커뮤니티 상세 보기 ok
router.get('/boards/:boardId', authMiddleware, boardController.boardDetail)

// 커뮤니티 글 수정. ok <-- 되는데 S3 미연결 해보세요
router.patch('/boards/:boardId', upload.single("image"), authMiddleware, boardController.boardPatch)

// 커뮤니티 글 삭제. ok
router.delete('/boards/:boardId', authMiddleware, boardController.boardDelete)

// 게시물 좋아요
router.post('/boards/:boardId/like', authMiddleware, likeController.likePost);

// 게시물에 좋아요 취소
router.delete('/boards/:boardId/like', authMiddleware, likeController.removeLike);




// 다 되었으나 지금 에러 핸들링이 많이 부족하고, 또한 작성자가 아니라 다른 사람도 게시물을 수정 하고 삭제 할 수 있음. ----------------------------------

export default router
