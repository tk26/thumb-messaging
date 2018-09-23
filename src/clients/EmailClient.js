const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');
const config = require('../../config.js');

const getMailer = () => {
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
          logger: false,
          debug: false
      };
      mailer = nodemailer.createTransport(mailConfig);
  }
  return mailer;
}

const mailer = getMailer();

module.exports = class EmailClient{
  static async sendMessage(message){
    let mailOptions = {
      from: message.from,
      to: message.to,
      subject: message.subject,
      html: message.body
    };
    let error = '';
    let status;
    try{
      await mailer.sendMail(mailOptions);
      status = 'ok';
    } catch (err){
      error = err;
      status = 'error';
    }
    return {
      message: message,
      response: {
        status,
        error
      }
    }
  }
}
