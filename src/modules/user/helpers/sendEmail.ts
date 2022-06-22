import sgMail from '@sendgrid/mail';
import { ForgotPasswordDto } from '../user.dto';

sgMail.setApiKey('');

export const sendEmail = async (forgotPassDto: ForgotPasswordDto) => {
  const msg = {
    to: forgotPassDto,
    from: 'no-reply@emi.com',
    subject: 'Hello there',
    text: 'This is a test',
    html: '<h1>Test</h1>',
  };
  try {
    await sgMail.send(msg);
  } catch (e) {
    console.log(e);
  }
};
