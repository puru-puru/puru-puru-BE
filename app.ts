import express, { Express, Request, Response } from "express";
// import path from 'path'
// import morgan from 'morgan'
// import nunjucks from 'nunjucks'
// import { sequelize } from './models'
// import sequelize from './src/models';
import sequelize from "./models/index";
import router from "./src/routes/index";

const app: Express = express();
const port = 3000;

// nunjucks.configure('views', {
//     express: app,
//     watch: true
// })

app.use(express.json());
app.use("/", router);

app.listen(port, async () => {
  console.log(port, "Server Start");

  await sequelize
    .authenticate()
    .then(async () => {
      console.log("connected DB");
    })
    .catch((e: Error) => {
      console.log(e);
    });
});
