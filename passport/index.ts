import { Users } from '../models/Users';
import { configureKakaoStrategy } from './kakaoStrategy';

// Passport 설정 !
export const configurePassport = (passport: any) => {
  // 이걸 통해서 전략을 패스포트에 등록 ..
  configureKakaoStrategy(passport);

  // 사용자 정보를 세션에 저장할 때 호출 하는 함수.
  passport.serializeUser(function(user: any, done: any) {
    // 사용자 정보 중 어떤 정보를 세션에 저장할지를 정의..
    done(null, user.userId);
  });

   // 세션에 저장된 사용자 정보를 기반으로 실제 사용자 객체를 조회하는 함수..
  passport.deserializeUser(async function(id: any, done: any) {
    try {
      // 유저의 고유값 pk (고유값?) 로 조회
      const user = await Users.findByPk(id);
      if (user) {
        // 사용자 정보가 조회되면 조회된 정보를 사용하여 사용자 객체를 만들어 done 콜백 호출
        done(null, user.get());
      } else {
        // 실패ㅐㅐㅐㅐ
        done(null, null);
      }
    } catch (error) {
      // 하단은 아예 에러
      done(error, null);
    }
  });
};