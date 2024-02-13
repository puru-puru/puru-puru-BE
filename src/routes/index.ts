import express from "express";
import authRouter from './auth.router'
import boardRouter from './board.router'
import testRouter from './test.router'
import mainRouter from './main.router'
import errorhandleMiddleware from "../middlewares/errorhandle.middleware";

const router = express.Router();

router.use('/api', [authRouter, boardRouter, testRouter, mainRouter])
router.use(errorhandleMiddleware);


export default router;
