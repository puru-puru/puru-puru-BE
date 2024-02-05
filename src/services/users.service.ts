// // 어플리케이션의 중간 부분. API 핵심적인 동작이 많이 일어남

// import { UsersRepository } from '../repositories/users.repository'

// export class UsersService {
//     usersRepository = new UsersRepository()

//     createUser = async (nickname: string, email: string, password: string) => {
//         const createUser = await this.usersRepository.createUser(
//             nickname,
//             email,
//             password 
//         )
//         return {
//             nickname: createUser.nickname,
//             email: createUser.email,
//             password: createUser.password 
//         }
//     }
// }