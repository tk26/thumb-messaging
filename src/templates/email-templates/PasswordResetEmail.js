const Email = require('../../domain/delivery_methods/Email');
const EmailTemplate = require('./EmailTemplate.js');

module.exports = class PasswordResetEmail extends EmailTemplate {
  /**
   * @param {Object} messageParameters
   * @returns {void}
   */
  static validateMessageParameters(messageParameters){
    super.validateMessageParameters(messageParameters);
    if (!('resetBaseUrl' in messageParameters))
    {
      throw Error('resetBaseUrl is a required message param when sending the Welcome Email.');
    }
    if (!('resetToken' in messageParameters))
    {
      throw Error('resetToken is a required message param when sending the Welcome Email.');
    }
  }

  /**
   * @param {Object} messageParameters
   * @returns {Email}
   */
  static createEmail(messageParameters){
    const { toEmailAddress, resetBaseUrl, resetToken } = messageParameters;
    let emailBody = '<p>Please click <a href="'+ resetBaseUrl +'/#/reset/'+ resetToken +'">HERE</a> ' +
    'to reset your account password </p>';
    const subject = 'Reset your Thumb Password';
    const from = 'accounts@thumbtravel.com';
    const scheduledTime = new Date();
    return new Email(scheduledTime, from, toEmailAddress, subject, emailBody);
  }
}
