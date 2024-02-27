import nodemailer from 'nodemailer';
import dotenv from 'dotenv'

dotenv.config()

export class EmailUtils {
sendVerificationEmail = async (email: string, url: string) => {
    try {
    console.log(`[sendVerificationEmail] Start - email: ${email}, URL: ${url}`);
      const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_USER,
        host: 'smtp.naver.com',
        port: parseInt(process.env.EMAIL_PORT || '587'),
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
          user: process.env.USER_ID,
          pass: process.env.USER_PASSWORD
        },
      });

      const mailOptions: nodemailer.SendMailOptions = {
        from: "dnwls70000@naver.com",
        to: email,
        subject: '푸릇푸릇 인증 메일 서비스 입니다 !!!',
        html: `<form action="${url}" method="POST">
          <h2 style="margin: 20px 0">안녕하세요! 푸릇푸릇 인증 메일 발송 입니다 ! </h2>
          <button style="background-color: #72A474; color: #fff; width: 80px; height: 40px; border-radius: 20px; border: none;">
            인증하기!
          </button>
        </form>`,
      };

      const info = await transporter.sendMail(mailOptions);

        console.log(`[sendVerificationEmail] Email sent - email: ${email}`);
      console.info(`Email sent - [${info.messageId}] ${info.response}`);
    } catch (err: any) {
      console.error(`Failed to send mail - [${err.name}] ${err.message}`);
      throw err;
    }
  }
}
