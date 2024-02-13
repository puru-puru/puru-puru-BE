import { Users } from "../../models/Users";

export class UserRepository {
    // 바꾸어야 할듯
  setName = async (nickname: string, user: any) => {
    try {
      await Users.update({ nickname }, { where: { id: user.id } });
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
}
