import dotenv from 'dotenv'
dotenv.config()

const config = {
  development : {
    username : 'admin',
    password : 'admin1234',
    database : 'testtt',
    host : 'database-1.chqgco4smv5l.ap-northeast-2.rds.amazonaws.com',
    dialect : 'mysql'
  }
};

export default config;

// 1. Config.josn 으로 변경 데이터베이스 이름 바꾸고 
// 데이터베이스 이름 만들어서
// npx sequelize-cli db:create 로 디비 만듦

// 2. 다시 config.ts 로 빠꾸 
//  여기서 부터 선택이긴 한데. 