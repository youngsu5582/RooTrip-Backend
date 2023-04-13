import { Service } from "typedi";
import mailer from "nodemailer";

import emailConfig from "../../config/emailConfig";
import { addVerify, getVerify } from "../utils/Redis";
import { EmailVerifyDto } from "../dtos/AuthDto";

@Service()
export class EmailService {
  private VerifySubject = "RooTrip 이메일 인증";
  private ResetSubject = "RooTrip 비밀번호 초기화";
  constructor() {}
  public async sendVerify(email: string) {
    const verifyNum = Math.floor(Math.random() * 100000)
      .toString()
      .padStart(6, "5");
    const transporter = mailer.createTransport(emailConfig);

    const mailOptions = {
      from: "RooTripEmail@gmail.com",
      to: email,
      subject: this.VerifySubject,
      html: `<h1>${verifyNum}</h1>`
    };

    await addVerify(email, verifyNum);
    const result = await transporter.sendMail(mailOptions);
    if (result) return true;
    else return false;
  }
  public async authVerify(emailVerifyDto: EmailVerifyDto) {
    const { email, verifyNumber } = emailVerifyDto;
    const storedNumber = await getVerify(email);
    if (storedNumber === verifyNumber) return true;
    else return false;
  }
  public async sendPassword(email: string, password: string) {
    const transporter = mailer.createTransport(emailConfig);
    const mailOptions = {
      from: "RooTripEmail@gmail.com",
      to: email,
      subject: this.ResetSubject,
      html: `<h1>${password}</h1>`
    };
    const result = await transporter.sendMail(mailOptions);
    if (result) return true;
    else return new Error("이메일 전송 실패");
  }
}
