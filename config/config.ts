import dotenv from 'dotenv'
dotenv.config()

export const config = {
  development : {
    username : 'admin',
    password : 'admin1234',
    database : 'testtt',
    host : 'database-1.chqgco4smv5l.ap-northeast-2.rds.amazonaws.com',
    dialect : 'mysql'
  }
};
