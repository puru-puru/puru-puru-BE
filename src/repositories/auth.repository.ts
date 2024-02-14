// // DB 와 맞닿아 있는 곳.
// import { where } from "sequelize";
// import { Users } from "../../models/Users";

// export class AuthRepository {
//   // 회원 가입
//   signupUser = async (email: string, nickname: string, password: string) => {
//     try {
//       const signupUser = await Users.create({
//         email,
//         nickname,
//         password,
//       });
//       return signupUser;
//     } catch (err) {
//       throw err;
//     }
//   };

//   // 로구인
//   loginUser = async (email: string, password: string) => {
//     try {
//       const loginUser = await Users.findOne({
//         where: { email },
//       });
//       return loginUser;
//     } catch (err) {
//       throw err;
//     }
//   };

//   // 로그아웃
//   signOut = async (user: any) => {
//     try {
//       await Users.update(
//         { hashedRefreshToken: null },
//         { where: { email: user.email } }
//       );
//     } catch (err) {
//       throw err;
//     }
//   };
// }
