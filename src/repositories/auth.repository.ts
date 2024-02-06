// DB 와 맞닿아 있는 곳.
// import { where } from 'sequelize'
import { where } from "sequelize";
import { Users } from "../../models/Users";

export class AuthRepository {
  signupUser = async (nickname: string, email: string, password: string) => {
    try {
      const signupUser = await Users.create({
        nickname,
        email,
        password,
      });
      return signupUser;
    } catch (err) {
      throw err;
    }
  };

  loginUser = async (email: string, password: string) => {
    try {
      const loginUser = await Users.findOne({
        where: { email },
      });
      return loginUser;
    } catch (err) {
      throw err;
    }
  };

  logoutUser = async (user: any) => {
    try {
      await Users.update({ hashedRefreshToken: null }, { where: { id: user } });
    } catch (err) {
      throw err;
    }
  };


}
