import express from "express";
import { Request, Response } from "express";
import axios from "axios";
import { Users } from "../../models/Users";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from 'dotenv';
import qs from "qs";

dotenv.config();

const router = express.Router();

const acc: string = process.env.JWT_ACCESS_SECRET_KEY || "default_access_secret_key";
const rcc: string = process.env.JWT_REFRESH_SECRET_KEY || "default_refresh_secret_key";
const hash: string = process.env.BCRYPT_SALT || "default_salt_key";

router.post('/api/auth/login/kakao', async (req: Request, res: Response) => {
  try {
    const code = req.body.code;
    console.log("Step 1: Code Received ---------------------------------------------------------------------------", code);
    // 카카오로부터 인증 코드를 받고, 토큰을 요청하여 토큰을 발급받습니다.
    const body = qs.stringify({
      grant_type: 'authorization_code',
      client_id: process.env.KAKAO_CLIENT_REST_ID,
      client_secret: process.env.KAKAO_CLIENT_SECRET || 'IpefAzgT5iWTe9vXlvQBLH8svMeVOeeH',
      redirect_uri: 'http://localhost:5173/api/auth/login/kakao/return' || 'https://purupuru.store/api/auth/login/kakao/return' ,
      code: code
    })
    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };
    console.log("Step 2: Requesting Access Token... ---------------------------------------------------------------------------");
    const tokenResponse = await axios.post('https://kauth.kakao.com/oauth/token', body, config);
    const accessToken = tokenResponse.data.access_token;
    console.log("Step 3: Access Token Received  ----------------------------------------------------------------------------", accessToken);
    console.log("Step 4: Requesting User Info... ---------------------------------------------------------------------------");
    const userInfoResponse = await axios.get('https://kapi.kakao.com/v2/user/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    console.log("Step 5: User Info Received - ---------------------------------------------------------------------------", userInfoResponse.data);
    // 카카오로부터 받은 사용자 정보를 확인하고, 해당 사용자를 DB에서 조회하여 유저 정보를 가져옵니다.
    const userInfo = userInfoResponse.data;
    // 이후 사용자 정보를 DB에서 조회하여 유저 정보를 가져옵니다.
    const user = await Users.findOne({
      where: { snsId: userInfo.id } // 변경된 부분
    });
    if (user) {
      console.log("Step 6: User Found - ---------------------------------------------------------------------------", user);
      // 사용자가 이미 존재하는 경우에는 기존의 토큰을 갱신하거나 새로 발급할 수 있습니다.
      const accessToken = jwt.sign({ email: user.email }, acc, { expiresIn: "5h" });
      const refreshToken = jwt.sign({ email: user.email }, rcc, { expiresIn: "7d" });
      console.log("Step 7: New Tokens Generated ---------------------------------------------------------------------------");
      // 응답으로 토큰을 보내줍니다.
      res.status(200).json({
        accessToken,
        refreshToken,
        hasNickname: !!user.nickname,
        email: user.email,
      });
    } else {
      console.log("Step 8: User Not Found ---------------------------------------------------------------------------");
      // 사용자가 존재하지 않는 경우, 새로운 사용자로 등록할 수 있습니다.
      // 이 부분은 해당 프로젝트의 사용자 등록 기능에 따라 달라집니다.
      res.status(404).json({ message: '사용자 정보를 찾을 수 없습니다.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류' });
  }
});
export default router;