import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  async sendEmail(email: string, randomPass: string) {
    const mailTransporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'earnestine15@ethereal.email',
        pass: 'DVPPZGDARAxsh3M8yc',
      },
    });

    const details = {
      from: 'earnestine15@ethereal.email',
      to: `${email}`,
      subject: 'Password Reset',
      text: '<h2>Here is your password reset </h2>',
      html: `<b>Hello</b> <br> <p>Your one-time password is: ${randomPass}! You chould change the password into your account`,
    };

    mailTransporter.sendMail(details, (e, s) => {
      console.log(e);
      console.log(s);
    })
  }
}
