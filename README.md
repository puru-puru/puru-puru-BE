
1. 데이터 베이스를 만들고 싶을때. 

1-1. /config -> config.ts 파일을 -> json 확장자로 변경.
1-2. 데이터 베이스 이름 설정.
1-3. npx sequelize-cli db:create 로 데이터 베이스 생성.
1-4. 확인 후 config.json 파일을 -> ts 확장자로 변경.


2. 데이터 베이스에 테이블을 추가 하고 싶을 경우. 

2-1. app.ts 부분에 snyc 부분 주석 해제.
2-2. /models 에서 테비을 작업 후 
2-3. ts-node app.ts 실행 시 테이블 생성.