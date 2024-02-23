import dotenv from 'dotenv'
dotenv.config()

interface DatabaseConfig { // index.ts 에서 오류 발생 하여 추가함.
  username: string;
  password: string;
  database: string;
  host: string;
  dialect: string;
}

const config: {
  development: DatabaseConfig;
} = {
  development: {
    username: process.env.MYSQL_USERNAME || "",
    password: process.env.MYSQL_PASSWORD || "",

    database: process.env.MYSQL_DATABASE || "",
    // database: process.env.MYSQL_TESTDB || "",

    host: process.env.MYSQL_HOST || "",
    dialect: 'mysql'
  }
};

export default config;

// 1. Config.josn 으로 변경 데이터베이스 이름 바꾸고 
// 데이터베이스 이름 만들어서
// npx sequelize-cli db:create 로 디비 만듦

// 2. 다시 config.ts 로 빠꾸 
//  여기서 부터 선택이긴 한데. 