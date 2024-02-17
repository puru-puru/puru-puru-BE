// 선언 파일 타입 추론을 돕고 interface, type 관리 ?
import { Users } from "./models/Users";

export {};

declare global {
  namespace Express {
    interface Request {
      user?: Users;
      // imagePath?: string;
      key?: string;
    }
  }
}

export class User {
  uuid:string;
  nickname:string;
  
}