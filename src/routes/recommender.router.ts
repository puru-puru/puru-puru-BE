import express from 'express'
// import express, { Request, Response } from 'express'; // TS에서 ES6문법으로 작성할 때 이와 같이 작성함.
// import {  } from '../controllers/';
import authMiddleware  from '../middlewares/auth.middleware'

const router = express.Router()

// const commentController = new CommentController();


// 위치기반 지도 알림
router.post('/shoprecommend', authMiddleware )





export default router