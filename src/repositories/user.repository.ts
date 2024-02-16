import { options } from "joi";
import { Users } from "../../models/Users";

export class UserRepository {

  setName = async (nickname: string, user: any) => {
    try {
      await Users.update({ nickname }, { where: { id: user.userId } });
    } catch (err) {
      throw err;
    }
  };

  createUser = async (options: any) => {
    try {
      const createUser = await Users.create(options);

      if (!createUser) {
        return null;
      }

      return createUser;
    } catch (err) {
      throw err;
    }
  };

  findUsers = async (options: any) => {
    try {
      const findUsers = await Users.findAll(options);
      if (!findUsers.length) {
        return null;
      }
      return findUsers;
    } catch (err) {
      throw err;
    }
  };

  findUser = async (options: any) => {
    try {
      const findUser = await Users.findOne(options);

      if (!findUser) {
        return null;
      }

      return findUser;
    } catch (err) {
      throw err;
    }
  };

  updateUser = async (data: any, options: any) => {
    try {
      const updateUser = await Users.update(data, options);
      if (!updateUser) {
        return null;
      }
      return updateUser;
    } catch (err) {
      throw err;
    }
  };

  findPkUser = async (options: any) => {
    try {
      const findPkUser = await Users.findByPk(options)

      if(!findPkUser) {
        return null;
      }

      return findPkUser
    } catch (err) {
      throw err;
    }
  }

  agreedService = async (userId: any, agreedService: boolean) => {
    try {
      await Users.update({ agreedService }, { where: { id: userId } })
    } catch (err) {
      
    }
  }
}