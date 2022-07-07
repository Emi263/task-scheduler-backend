import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  async sendEmail(email: string, randomPass: string) {
    let mailTransporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'norbert.conn2@ethereal.email',
        pass: 'hxJ6bWQn397jQPPay1',
      },
    });

    let details = {
      from: 'norbert.conn2@ethereal.email',
      to: `${email}`,
      subject: 'test',
      text: '<h2>Test </h2>',
      html: `<b>Hello</b> <br> <p>Your one-time password is: ${randomPass}! You chould change the password into your account`,
    };

    mailTransporter.sendMail(details, (e, s) => {
      console.log(e);
      console.log(s);
    });
  }
}
