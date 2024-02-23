import { Users } from '../models/Users';
import jwt, { JwtPayload } from 'jsonwebtoken'
import { configureKakaoStrategy } from './kakaoStrategy';

// Passport 설정 !
export const configurePassport = (passport: any) => {
  // 이걸 통해서 전략을 패스포트에 등록 ..
  configureKakaoStrategy(passport);

  // 사용자 정보를 세션에 저장할 때 호출 하는 함수. 
  passport.serializeUser(function (token: string, done: any) {
    // Serialize the entire token
    done(null, token);
  });

  // 세션에 저장된 사용자 정보를 기반으로 실제 사용자 객체를 조회하는 함수..
  passport.deserializeUser(async function (token: string, done: any) {
    try {
      // Decode the token to get userId
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET_KEY as string) as JwtPayload;
      const userId = decoded.userId;

      // Retrieve user from the database using userId
      const user = await Users.findByPk(userId);

      if (user) {
        // 사용자 정보가 조회되면 조회된 정보를 사용하여 사용자 객체를 만들어 done 콜백 호출
        done(null, user.get());
      } else {
        // 실패 시
        done(null, null);
      }
    } catch (error) {
      // 에러 발생 시
      done(error, null);
    }
  });
};