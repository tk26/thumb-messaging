const Email = require('../../domain/delivery_methods/Email');
const EmailTemplate = require('./EmailTemplate.js');

module.exports = class PasswordResetConfirmationEmail extends EmailTemplate {
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
  }

  /**
   * @param {Object} messageParameters
   * @returns {Email}
   */
  static createEmail(messageParameters){
    const { toEmailAddress, resetBaseUrl } = messageParameters;
    let emailBody = '<p> Hello,</p><br/>' +
    '<p>You have successfully changed your password.</p>' +
    '<p>Please feel free to log in to thumb using the mobile app.</p><br/>' +
    '<p>If this wasn\'t you or believe an unauthorized person has accessed your account,' +
    ' please immediately reset your password. Then, contact us by emailing support@thumbtravel.com so we' +
    ' can confirm your account is secure.</p><br/>' +
    '<p>To reset your password tap "Forgot your password?" on the login screen in the mobile app or ' +
    'click <a href="'+ resetBaseUrl +'/#/forgot">HERE</a>.</p><br/>' +
    '<p>We hope you enjoy traveling with thumb.</p><br/>' +
    '<p>Thank you,</p>' + '<p>The thumb Team</p>';
    const subject = 'thumb is more than just a ride.';
    const from = 'accounts@thumbtravel.com';
    const scheduledTime = new Date();
    return new Email(scheduledTime, from, toEmailAddress, subject, emailBody);
  }
}
