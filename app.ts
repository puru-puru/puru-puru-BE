import express, { Express, Request, Response, NextFunction } from "express";
import cookieParser from 'cookie-parser'
import expressSession from 'express-session'
import sequelize from "./models/index";
import router from "./src/routes/index";
import dotenv from 'dotenv'
import cors from 'cors'
import passport from "passport";
import socialRouter from './src/routes/social.router'
import { configurePassport } from './passport';
import { Users } from './models/Users' // 유저
import { Boards } from "./models/Boards"; // 게시판
import { Likes } from './models/likes' // 좋아요
import { Comments } from './models/Comments' // 댓글
import { Diaries } from './models/Diaries' // 다이어리
import { UserPlant } from './models/UserPlant' // 다이어리와 연계되는 식물
import { SavedTemplelates } from './models/SavedTemplelates' // 사용자가 저장한 질문과 답변
import { Galleries } from "./models/Galleries"; // 사용자의 반려 식물 중 사진첩.
import { Templelates } from './models/Templelates' // 질문 템플릿
import { Plants } from './models/plants' // 식물
import { plantsDB } from './src/seeders/plantsDB' // 식물 시드 데이터
import { Missions } from './models/Missions' //미션
import { missionsDB } from './src/seeders/missionsDB' // 미션 시드 데이터
import { templelatesDB } from './src/seeders/templelatesDB' // 템플렛 시드 데이터

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(cors());

app.use(express.json());

app.use(cookieParser());

app.use(
  expressSession({
    secret: process.env.MY_SECRET_KEY as string,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      secure: true, // https 일때 도 값이 잘 들어갈 수 있도록 배포시에 주석풀기.
    },
  })
);

// Passport 설정
configurePassport(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use("/", router, socialRouter);

// 여기는 시드 데이터를 삽입하는 메서드 입니다.
const createPlantDB = () => {
  plantsDB.map(plants => {
    Plants.create(plants);
  })
}

const createMissionDB = () => {
  missionsDB.map(missions => {
    Missions.create(missions);
  })
}

const createTemplelateDB = () => {
  templelatesDB.map(templelates => {
    Templelates.create(templelates);
  })
}

// createPlantDB(); 
// createMissionDB(); 
// createTemplelateDB();

app.listen(port, async () => {
  console.log(`----- Server ${port} Start -----`);
  sequelize
    .authenticate()
    .then(async () => {
      // await sequelize.sync(); // 이 부분 사용시에 모델 -> 부분에 테이블을 설정 할 때 마다 디비에 추가함.
      // await Users.sync()
      // await Boards.sync()
      // await Diaries.sync()
      // await Likes.sync()
      // await Comments.sync()
      // await Missions.sync()
      // await Plants.sync()
      // await UserPlant.sync()
      // await Galleries.sync()
      // await Templelates.sync()
      // await SavedTemplelates.sync()
      console.log("------connected DB------");
    })
    .catch((e: Error) => {
      console.log(e);
    });
});
