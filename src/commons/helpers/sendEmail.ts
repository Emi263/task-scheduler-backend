const nodemailer = require('nodemailer');

async function sendEmail(pass: string) {
  //create a fake account
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {},
  });

  const options = {
    from: 'emi69@gmail.com',
    to: 'emi44@mailinator.com',
    subject: 'Kot',
    text: `<h3>Hello, your new password is: ${pass}. Please go to change the password</>`,
  };

  transporter.sendMail(options, function (err, info) {
    if (err) {
      console.log(err);

      return;
    }
    console.log(info.response);
  });
}

export default sendEmail;
