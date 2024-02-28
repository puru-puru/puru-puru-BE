import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
import { Strategy as KakaoStrategy } from 'passport-kakao';
import { v4 as uuidv4 } from 'uuid';
import { Users } from '../models/Users';

dotenv.config()

const hash: string = process.env.BCRYPT_SALT as string;
const salt = bcrypt.genSaltSync(parseInt(hash));

// 6. 전략 구성 시작.
export const configureKakaoStrategy = (passport: any) => {
  passport.use(new KakaoStrategy(
    {
      clientID: process.env.GMAIL_OAUTH_CLIENT_ID as string,
      clientSecret: process.env.GMAIL_OAUTH_CLIENT_SECRET as string,
      callbackURL: 'https://purupuru.store/api/auth/login/google/return',
    },
    // 인증 후 사용자 프로필을 처리 하는 콜백 함수.
    async (accessToken, refreshToken, profile, done) => {
      console.log('구글 프로필', profile);
      console.log(accessToken);
      console.log(refreshToken);
      try {
        // 받아온 프로필 에서 정보 추출
        const { id, properties, kakao_account } = profile._json;

          // 디비에서 사용자가 이미 존재하는지 확인. 
        const existingUser = await Users.findOne({
          where: { email: kakao_account?.email, provider: 'kakao' },
        });

          // 사용자가 존재하면 해당 사용자를 반환. Done 함수를 실행 하고 전략을 종료.
          if (existingUser) {
            return done(null, existingUser);
          }
          const hashedRefreshToken = bcrypt.hashSync(refreshToken, salt);
        // 여기서 존재 하지 않으면 여기서 생성. 두 번째 인수 콜백이 실행된다.
        const newUser = await Users.create({
          status: 'USER',
          uuid: uuidv4(),
          agreedService: false,
          snsId: id,
          provider: 'kakao',
          email: kakao_account?.email || null,
          hashedRefreshToken: hashedRefreshToken,
        });
        // DONE...
        return done(null, newUser);
      } catch (error) {
        return done(error, null);
      }
    }
  ));
};