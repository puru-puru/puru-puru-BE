import express from "express";
import authRouter from './auth.router'

const router = express.Router();

router.use('/api', [authRouter])

export default router;
