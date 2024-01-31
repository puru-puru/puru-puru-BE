import express, { Express, Request, Response } from "express";
import sequelize from "./models/index";
import router from "./src/routes/index";

const app: Express = express();
const port = 3000;

app.use(express.json());
app.use("/", router);

app.listen(port, async () => {
  console.log(port, "Server Start");

  await sequelize
    .authenticate()
    .then(async () => {
      await sequelize.sync(); // 이 부분 사용시에 모델 -> 부분에 테이블을 설정 할 때 마다 디비에 추가함.
      console.log("connected DB");
    })
    .catch((e: Error) => {
      console.log(e);
    });
});
