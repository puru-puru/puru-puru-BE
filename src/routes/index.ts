import express from "express";
import authRouter from './auth.router'
import errorhandleMiddleware from "../middlewares/errorhandle.middleware";
import authMiddleware from "../middlewares/auth.middleware";

const router = express.Router();

router.use('/api', [authRouter])
router.use(errorhandleMiddleware);
router.use(authMiddleware)

export default router;
