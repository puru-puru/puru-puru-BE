import express from "express";
import { Request, Response } from "express";
import { Users } from "../../models/Users";
import axios from "axios";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import qs from "qs";
import passport from "passport";
import bcrypt from "bcrypt";

dotenv.config();

const router = express.Router();

const acc: string = process.env.JWT_ACCESS_SECRET_KEY || "default_access_secret_key";
const rcc: string = process.env.JWT_REFRESH_SECRET_KEY || "default_refresh_secret_key";
const hash: string = process.env.BCRYPT_SALT || "default_salt_key";

// 토큰 부여 부분 .. - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const generateTokens = async (email: string) => {
  try {
    const accessToken = jwt.sign(
      { email },
      acc,
      { expiresIn: "5h" }
    );

    const refreshToken = await hashedRefreshToken(email);

    return { accessToken, refreshToken };
  } catch (err) {
    throw err;
  }
};

const hashedRefreshToken = async (email: string) => {

  const newRefreshToken = jwt.sign({ email }, rcc, { expiresIn: "7d" });

  const salt = bcrypt.genSaltSync(parseInt(hash));

  const hashedRefreshToken = bcrypt.hashSync(
    newRefreshToken || "default-token" ,
    salt
  );
  
  await Users.update(
    { hashedRefreshToken },
    { where: { email } }
  );
  return hashedRefreshToken;
}



// 카카오 소셜 로그인  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
router.post('/api/auth/login/kakao', async (req: Request, res: Response) => {
  try {
    const code = req.body.code;
    // 카카오로부터 인증 코드를 받고, 토큰을 요청하여 토큰을 발급받습니다.
    const body = qs.stringify({
      grant_type: 'authorization_code',
      client_id: process.env.KAKAO_CLIENT_REST_ID,
      client_secret: process.env.KAKAO_CLIENT_SECRET,
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
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = await generateTokens(user.email);

    // 토큰
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
    const code: string = req.body.code;

    // 토큰을 얻기 위한 요청 데이터를 구성합니다.
    const tokenData = {
      grant_type: 'authorization_code',
      client_id: process.env.GMAIL_OAUTH_CLIENT_ID,
      client_secret: process.env.GMAIL_OAUTH_CLIENT_SECRET,
      redirect_uri: 'http://localhost:5173/api/auth/login/google/return',
      code: code,
    };

    // 토큰 및 사용자 정보를 얻습니다.
    const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', JSON.stringify(tokenData), {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const accessToken: string = tokenResponse.data.access_token;

    const userInfoResponse = await axios.get('https://www.googleapis.com/userinfo/v2/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    const userInfo: any = userInfoResponse.data;

    // 데이터베이스에서 사용자를 찾거나 등록합니다.
    let user = await Users.findOne({
      where: { email: userInfo.email }
    });

    if (!user) {
      // 사용자가 존재하지 않으면 새로운 사용자로 등록합니다.
      user = await Users.create({
        email: userInfo.email,
        snsId: userInfo.id,
        provider: "google"
      });
    }

    // 새로운 액세스 및 리프레시 토큰을 생성합니다.
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = await generateTokens(user.email);

    // 보내주기
    res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      hasNickname: !!user.nickname,
      email: user.email,
    });
  } catch (error) {
    console.error("외 에러들:", error);
    res.status(500).json({ message: '서버 오류' });
  }
});



export default router;
