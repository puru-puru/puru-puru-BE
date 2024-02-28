import express from "express";
import { Request, Response } from "express";
import { Users } from "../../models/Users";
import axios from "axios";
import passport from "passport";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import qs from "qs";
import bcrypt from "bcrypt";

dotenv.config();

const router = express.Router();

const acc: string = process.env.JWT_ACCESS_SECRET_KEY || "default_access_secret_key";
const rcc: string = process.env.JWT_REFRESH_SECRET_KEY || "default_refresh_secret_key";
const hash: string = process.env.BCRYPT_SALT || "default_salt_key";


// 카카오 소셜 로그인  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
router.post('/api/auth/login/kakao', async (req: Request, res: Response) => {
  try {
    const code = req.body.code;
    // 카카오로부터 인증 코드를 받고, 토큰을 요청하여 토큰을 발급받습니다.
    const body = qs.stringify({
      grant_type: 'authorization_code',
      client_id: process.env.KAKAO_CLIENT_REST_ID,
      client_secret: process.env.KAKAO_CLIENT_SECRET || 'IpefAzgT5iWTe9vXlvQBLH8svMeVOeeH',
      redirect_uri: 'http://localhost:5173/api/auth/login/kakao/return' || 'https://purupuru.store/api/auth/login/kakao/return',
      code: code
    })
    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };
    const tokenResponse = await axios.post('https://kauth.kakao.com/oauth/token', body, config);

    const accessToken = tokenResponse.data.access_token;

    const userInfoResponse = await axios.get('https://kapi.kakao.com/v2/user/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    // 카카오로부터 받은 사용자 정보를 확인하고, 해당 사용자를 DB에서 조회하여 유저 정보를 가져옵니다.
    const userInfo = userInfoResponse.data;
    
    let user = await Users.findOne({
      where: { email: userInfo.kakao_account.email }
    });

    if (!user) {
      // 사용자가 존재하지 않는 경우, 새로운 사용자로 등록
      user = await Users.create({
        email: userInfo.kakao_account.email,
        snsId: userInfo.id,
        provider: "kakao"
      });
    }

    // 사용자가 이미 존재하는 경우에는 기존의 토큰을 갱신하거나 새로 발급할 수 있습니다.
    const newAccessToken = jwt.sign({ email: user.email }, acc, { expiresIn: "5h" });
    const newRefreshToken = jwt.sign({ email: user.email }, rcc, { expiresIn: "7d" });

    // 응답으로 토큰을 보내줍니다.
    res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      hasNickname: !!user.nickname,
      email: user.email,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류' });
  }
});


// 구글 부분 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
router.post('/api/auth/login/google', async (req: Request, res: Response) => {
  try {
    const code = req.body.code;
    
    // 구글로부터 인증 코드를 받고 토큰을 요청하여 토큰을 발급.
    const data = {
      grant_type: 'authorization_code',
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: 'http://localhost:5173/api/auth/login/google/return' || 'https://purupuru.store/api/auth/login/google/return',
      code: code
    };

    const response = await axios.post('https://oauth2.googleapis.com/token', qs.stringify(data), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const accessToken = response.data.access_token;

    // 구글로부터 받은 사용자 정보를 확인.
    const userInfoResponse = await axios.get('https://www.googleapis.com/userinfo/v2/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    const userInfo = userInfoResponse.data;

    let user = await Users.findOne({
      where: { email: userInfo.email }
    });

    if (!user) {
      // 사용자가 존재하지 않는 경우, 새로운 사용자로 등록
      user = await Users.create({
        email: userInfo.email,
        snsId: userInfo.id,
        provider: "google"
      });
    }

    // 사용자가 이미 존재하는 경우에는 기존의 토큰을 갱신하거나 새로 발급
    const newAccessToken = jwt.sign({ email: user.email }, acc, { expiresIn: "5h" });
    const newRefreshToken = jwt.sign({ email: user.email }, rcc, { expiresIn: "7d" });

    // 응답으로 토큰을 보내줍니다.
    res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      hasNickname: !!user.nickname,
      email: user.email,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류' });
  }
});


// 구글 소셜 패스 포투 부분
// router.get('/api/auth/login/google', passport.authenticate('google', { scope: [ 'email'] }));

// router.get(
//    '/api/auth/login/google/return',
//    passport.authenticate('google', { failureRedirect: '/' }), 
//    (req, res) => {
//       res.redirect('/');
//    },
// );

export default router;