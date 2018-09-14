const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');
const config = require('../../config.js');

module.exports = class EmailClient{
  constructor(){
    this.setMailer();
  }

  async sendMessage(from, to, subject, body){
    let mailOptions = {
      from: from,
      to: to,
      subject: subject,
      html: body
    };
    await this.mailer.sendMail(mailOptions);
  }

  setMailer(){
    let mailConfig;
    let mailer;
    if (process.env.NODE_ENV === 'prod' ){
        // all emails are delivered to destination
        let options = {
          auth: {
              api_key: config.SENDGRID_API_KEY
          }
        }

        mailer = nodemailer.createTransport(sgTransport(options));
    } else {
        // all emails are caught by ethereal.email
        mailConfig = {
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
                user: config.ETHEREAL_CREDENTIALS.user,
                pass: config.ETHEREAL_CREDENTIALS.password
            },
            logger: true,
            debug: true
        };
        console.log(mailConfig);
        mailer = nodemailer.createTransport(mailConfig);
    }
    this.mailer = mailer;
  }
}
