export {};

declare global {
  namespace Express {
    interface Request {
      user?: User
    }
  }
}

export class User {
  uuid:string;
  nickname:string;
}