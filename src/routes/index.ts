import express from "express";
import authRouter from './auth.router'
import boardRouter from './board.router'
import errorhandleMiddleware from "../middlewares/errorhandle.middleware";

const router = express.Router();

router.use('/api', [authRouter, boardRouter])
router.use(errorhandleMiddleware);


export default router;
