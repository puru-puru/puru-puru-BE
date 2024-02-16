import multer from 'multer';
import multerS3 from 'multer-s3';
import { S3Client } from '@aws-sdk/client-s3';
import path from 'path';

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.ACCESS_KEY as string,
    secretAccessKey: process.env.SECRET_ACCESS_KEY as string,
  },
  region: process.env.REGION as string,
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    acl: process.env.ACL_OPTIONS as string,
    bucket: process.env.BUCKET_NAME as string,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file: Express.MulterS3.File, cb) => {
      const extension = path.extname(file.originalname);
      const generatedKey = `test/${Date.now()}${extension}`;
      const fullUrl = `https://${process.env.BUCKET_NAME}.s3.${process.env.REGION}.amazonaws.com/${generatedKey}`;
      // req.imagePath = fullUrl; // 이 부분 주석 처리
      cb(null, generatedKey);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('유효하지 않은 파일입니다.'));
    }
  },
});

export default upload;
