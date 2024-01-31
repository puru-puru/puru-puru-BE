import { Users } from "../../models/Users";

console.log("======Create user Table======");
const create_table_user = async () => {
  // model 설정 변경만 반영하고 싶을 때
  // 존재 하지 않는 경우 테이블을 생성 하는 함수.
  await Users.sync();
  // 기존 테이블 Drop 후 새롭게 만들 때
  // 테이블을 생성하고 이미 존재하는 경우 삭제. 하는 함수임.
  await Users.sync({ force: true })
    .then(() => {
      console.log("Success Create user Table");
    })
    .catch((err: Error) => {
      console.log("Error in Create user Table : ", err);
    });
};

create_table_user();

