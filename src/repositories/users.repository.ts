import { Users } from "../../models/Users";

export class UsersRepository {
  createUser = async (nickname: string, email: string, password: string) => {
    // const createUser = await Users.create({
    //   nickname,
    //   email,
    //   password,
    // });

    return 1;
  };
  loginUser = async (email: string, password: string) => {
    console.log(email, password);
    const loginUser = await Users.findOne({
      where: { email },
    });

    return loginUser;
  };
}
