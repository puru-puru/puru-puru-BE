import dotenv from 'dotenv'
dotenv.config()

const config = {
  development : {
    username : process.env.DB_USER,
    password : process.env.DB_PASS,
    database : process.env.DB_NAME,
    host : process.env.DB_HOST,
    dialect : 'mysql'
  }
};

export default config;

// 1. Config.josn 으로 변경 데이터베이스 이름 바꾸고 
// 데이터베이스 이름 만들어서
// npx sequelize-cli db:create 로 디비 만듦

// 2. 다시 config.ts 로 빠꾸 
//  여기서 부터 선택이긴 한데. 