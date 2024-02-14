import express from 'express'
import { MyplantsController } from '../controllers/myplants.controller';
import authMiddleware  from '../middlewares/auth.middleware'

const router = express.Router()

const myplantscontroller = new MyplantsController();

// 주 페이지
router.get('/diaries', authMiddleware, myplantscontroller.showMyPlants)

// 반려 식물 등록
router.post('/diaries', authMiddleware, myplantscontroller.postMyPlant )

// 반려 식물 검색
router.get('/plants/search', authMiddleware, )

// 반려 식물 검색 후 저장
router.post('/plants/save', authMiddleware, )

// 반려 식물 신규 등록
router.post('/newplants', authMiddleware, )

// 반려 식물 탬플릿 작성
router.post('/templelates', authMiddleware)

// 반려 식물 탬플릿 작성
router.post('/:diaryId/templelates', authMiddleware)

export default router