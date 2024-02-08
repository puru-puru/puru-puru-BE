// // 이런 식으로 이미지가 들어갈 수 있게 설정함.. 타입스크립트는 어떻게 설정 해야 할지 알아봐야함.
// import dotenv from "dotenv";
// import AWS from "aws-sdk";
// import multer from "multer";
// import multerS3 from "multer-s3";
// import path from "path";

// dotenv.config();

// AWS.config.update({
//   region: process.env.REGION,
//   accessKeyId: process.env.ACCESS_KEY,
//   secretAccessKey: process.env.SECRET_ACCESS_KEY,
// });

// const s3 = new AWS.S3();

// // AWS S3 업로드 설정 부분.
// const storage = multerS3({
//     s3: new AWS.S3(), // AWS S3 connect
//     acl: "public-read-write", // S3 Bucket 읽기 쓰기 권한 부여
//     bucket: "quizzes-assets", // S3 Bucket name.
//     contentType: multerS3.AUTO_CONTENT_TYPE, // 파밀 MIME Type 자동 지정.
//     key: (_req, file, cb) => {
//     // 파일 이름 생성 및 반환
//     const extentsion = path.extname(file.originalname);
//     cb(null, `test/${Date.now()}_${extentsion}`);
//   },
// });

// const upload = multer({
//   storage,
//     limits: { fileSize: 5 * 1024 * 1024 },
//   fileFilter: (_req, file, cb) => {
//     if (file.mimetype.startsWith("image/")) {
//       cb(null, true);
//     } else {
//       cb(new Error("Invalid file type. Only images are allowed."));
//     }
//   },
// });

// export default upload;