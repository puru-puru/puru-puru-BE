import express from 'express'
import { MyplantsController } from '../controllers/myplants.controller';
import authMiddleware  from '../middlewares/auth.middleware'
import upload from '../../assets/upload'

const router = express.Router()

const myplantscontroller = new MyplantsController();

// 주 페이지 (본인 식물 + 템플릿 질문 포함)
router.get('/diaries', authMiddleware, myplantscontroller.showMyPlants)

// 반려 식물 등록
router.post('/diaries', authMiddleware, upload.single('image'), myplantscontroller.postMyPlant )

// 반려 식물 템플릿 질문에 답하기
router.patch('/random/templates/:templateId', authMiddleware, myplantscontroller.answering)

// 반려 식물 삭제
router.delete('/diaries/:diaryId', authMiddleware, myplantscontroller.deletePlants)

// 반려 식물 검색
router.get('/plants/search/:keyword?', myplantscontroller.searching)

// 반려 식물 검색 후 저장
router.post('/plants/:plantsId/save', authMiddleware, myplantscontroller.savePlants)

// 반려 식물 신규 등록
router.post('/newplants', authMiddleware, myplantscontroller.newPlants)


// 관리자용 이미지 업로드
router.post('/auth-image-uploader', authMiddleware, upload.single('image'), myplantscontroller.postImage )

// ====> 자세한 내용은 서비스 및 레포지토리 계층에서 알아 볼 수 있다.
export default router
