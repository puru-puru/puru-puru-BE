import { Request, Response, NextFunction } from "express";
import { Users } from "../../models/Users";
import { UserRepository } from "../repositories/user.repository";

export class UserService {
  userRepository = new UserRepository();

  setName = async (nickname: string, user: any) => {
    try {
      const setName = await this.userRepository.updateUser(
        { nickname },
        { where: { id: user.id } }
      );
      return { setName };
    } catch (err) {
      throw err;
    }
  };

  userInfo = async (userId: number) => {
    try {
      const userInfo = await this.userRepository.findPkUser(userId);
      
      if (!userInfo) {
        throw new Error("로그인한 사용자를 찾을 수 없습니다.");
      }
  
      const userData = {
        // id: userInfo.id,
        nickname: userInfo.nickname,
        email: userInfo.email,
      };
      return userData;
    } catch (err) {
      throw err;
    }
  };
}
