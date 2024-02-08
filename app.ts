import express, { Express, Request, Response, NextFunction } from "express";
import cookieParser from 'cookie-parser'
import expressSession from 'express-session'
import sequelize  from "./models/index";
import router from "./src/routes/index";
import cors from 'cors'
import { Boards } from "./models/Boards";
import { Users } from './models/Users'

const app: Express = express();
const port = process.env.PORT

app.use(express.json());
app.use(cookieParser())
app.use(cors())
// app.use(
//   expressSession({
//     secret: process.env.MY_SECRET_KEY,
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       maxAge: 1000 * 60 * 60 * 24,
//       secure: true, // https 일때 도 값이 잘 들어갈 수 있도록 배포시에 주석풀기.
//     },
//   })
// );


app.use("/", router);

app.listen(port, async () => {
  console.log(`----- Server ${port} Start -----`);
  await sequelize
    .authenticate()
    .then(async () => {
      await sequelize.sync(); // 이 부분 사용시에 모델 -> 부분에 테이블을 설정 할 때 마다 디비에 추가함.
      // await Users.sync({ force: true })
      // await Boards.sync({ force: true })
      console.log("------connected DB------");
    })
    .catch((e: Error) => {
      console.log(e);
    });
});