import nodemailer, { SentMessageInfo, TransportOptions, createTransport } from 'nodemailer';
import dotenv from 'dotenv';
import { OAuth2Client } from 'google-auth-library';

dotenv.config();

export class EmailUtils {
  sendVerificationEmail = async (email: string, url: string, isGoogle: boolean) => { // 이름 만 보아도 알겠지만 이메일 보내는 곳.
    try {
      let transporter;

      if (isGoogle) { // if 문을 통해서 구길, 혹은 네이버 인지 ..
        transporter = createTransport({
          service: process.env.GMAIL_SERVICE || 'gmail',
          auth: {
            type: 'OAuth2',
            user: 'ujins8201@gmail.com',
            clientId: process.env.GMAIL_OAUTH_CLIENT_ID,
            clientSecret: process.env.GMAIL_OAUTH_CLIENT_SECRET,
            refreshToken: process.env.GMAIL_OAUTH_REFRESH_TOKEN,
          },
        });
      } else {
        transporter = nodemailer.createTransport({
          service: process.env.EMAIL_USER,
          host: 'smtp.naver.com',
          port: parseInt(process.env.EMAIL_PORT || '587'),
          secure: process.env.EMAIL_SECURE === 'true',
          auth: {
            user: process.env.USER_ID,
            pass: process.env.USER_PASSWORD,
          },
        });
      }

      // 하단의 이 부분이 사용자 에게 보여지는 부분임. 
      const mailOptions: nodemailer.SendMailOptions = {
        from: isGoogle ? 'ujins8201@gmail.com' : 'dnwls70000@naver.com', // 삼. 항. 연. 산. 자.  사용.
        to: email,
        subject: '푸릇푸릇 인증 메일 서비스 입니다 !!!',
        html: `<form action="${url}" method="POST">
          <h2 style="margin: 20px 0">안녕하세요! 푸릇푸릇 인증 메일 발송 입니다 ! </h2>
          <button style="background-color: #72A474; color: #fff; width: 80px; height: 40px; border-radius: 20px; border: none;">
            인증하기!
          </button>
        </form>`,
      };

      const info: SentMessageInfo = await transporter.sendMail(mailOptions);

      console.log(`[sendVerificationEmail] Email sent - email: ${email}`);
      console.info(`Email sent - [${info.messageId}] ${info.response}`);
    } catch (err: any) {
      console.error(`Failed to send mail - [${err.name}] ${err.message}`);
      throw err;
    }
  }
}