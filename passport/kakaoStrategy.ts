import passport from 'passport';
import dotenv from 'dotenv'
import { Strategy as KakaoStrategy } from 'passport-kakao';
import { v4 as uuidv4 } from 'uuid';
import { Users } from '../models/Users';

dotenv.config()

// 전략 구성 시작.
export const configureKakaoStrategy = (passport: any) => {
  passport.use(new KakaoStrategy(
    {
      clientID: process.env.KAKAO_CLIENT_REST_ID as string,
      clientSecret: process.env.KAKAO_CLIENT_SECRET as string,
      // 알겠지만 이놈이 콜백.
      callbackURL: 'http://localhost:3000/api/auth/login/kakao/return',
    },
    // 인증 후 사용자 프로필을 처리 하는 콜백 함수.
    async (accessToken, refreshToken, profile, done) => {
      try {
        // 받아온 프로필 에서 정보 추출
        const { id, properties, kakao_account } = profile._json;

         // 디비에서 사용자가 이미 존재하는지 확인. 
        const existingUser = await Users.findOne({
          where: { email: kakao_account?.email, provider: 'kakao' },
        });

         // 사용자가 존재하면 해당 사용자를 반환.
        if (existingUser) {
          return done(null, existingUser);
        }
        // 여기서 존재 하지 않으면 여기서 생성.
        const newUser = await Users.create({
          status: 'USER',
          uuid: uuidv4(),
          agreedService: false,
          snsId: id,
          provider: 'kakao',
          email: kakao_account?.email || null,
        });

        // DONE...
        return done(null, newUser);
      } catch (error) {
        return done(error, null);
      }
    }
  ));
};