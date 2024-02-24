import { Users } from "../../models/Users";

export class UserRepository {

  setName = async (nickname: string, user: any) => {
    try {
      console.time("setName_repository--------------------"); // 성능 측정 시작
      await Users.update({ nickname }, { where: { id: user.userId } });
    } catch (err) {
      throw err;
    } finally {
      console.timeEnd("setName_repository--------------------");
    }
  };
  
  createUser = async (options: any) => {
    try {
      console.time("createUser_repository--------------------"); // 성능 측정 시작
      const createUser = await Users.create(options);
  
      if (!createUser) {
        return null;
      }
  
      return createUser;
    } catch (err) {
      throw err;
    } finally {
      console.timeEnd("createUser_repository--------------------");
    }
  };
  
  findUsers = async (options: any) => {
    try {
      console.time("findUsers_repository--------------------"); // 성능 측정 시작
      const findUsers = await Users.findAll(options);
  
      if (!findUsers.length) {
        return null;
      }
  
      return findUsers;
    } catch (err) {
      throw err;
    } finally {
      console.timeEnd("findUsers_repository--------------------");
    }
  };
  
  findUser = async (options: any) => {
    try {
      console.time("findUser_repository--------------------"); // 성능 측정 시작
      const findUser = await Users.findOne(options);
  
      if (!findUser) {
        return null;
      }
  
      return findUser;
    } catch (err) {
      throw err;
    } finally {
      console.timeEnd("findUser_repository--------------------");
    }
  };
  
  updateUser = async (data: any, options: any) => {
    try {
      console.time("updateUser_repository--------------------"); // 성능 측정 시작
      const updateUser = await Users.update(data, options);
  
      if (!updateUser) {
        return null;
      }
  
      return updateUser;
    } catch (err) {
      throw err;
    } finally {
      console.timeEnd("updateUser_repository--------------------");
    }
  };
  
  findPkUser = async (options: any) => {
    try {
      console.time("findPkUser_repository--------------------"); // 성능 측정 시작
      const findPkUser = await Users.findByPk(options);
  
      if (!findPkUser) {
        return null;
      }
  
      return findPkUser;
    } catch (err) {
      throw err;
    } finally {
      console.timeEnd("findPkUser_repository--------------------");
    }
  };
  
  agreedService = async (userId: any, agreedService: boolean) => {
    try {
      console.time("agreedService_repository--------------------"); // 성능 측정 시작
      await Users.update({ agreedService }, { where: { id: userId } });
    } catch (err) {
      throw err;
    } finally {
      console.timeEnd("agreedService_repository--------------------");
    }
  };

} 