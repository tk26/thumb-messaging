const Email = require('../../domain/delivery_methods/Email');
const EmailTemplate = require('./EmailTemplate.js');

module.exports = class VerificationEmail extends EmailTemplate {
  /**
   * @param {Object} messageParameters
   * @returns {void}
   */
  static validateMessageParameters(messageParameters){
    super.validateMessageParameters(messageParameters);
    if (!('verificationId' in messageParameters))
    {
      throw Error('verificationId is a required message param when sending the Welcome Email.');
    }
    if (!('verifyUrl' in messageParameters))
    {
      throw Error('verifyUrl is a required message param when sending the Welcome Email.');
    }
  }

  /**
   * @param {Object} messageParameters
   * @returns {Email}
   */
  static createEmail(messageParameters){
    const { toEmailAddress, verificationId, verifyUrl } = messageParameters;
    let emailBody = '<p> Welcome to thumb! In order to get started, you need to confirm your email address. ' +
    'When you confirm your email, we know that we will be able to update you on your travel plans.</p><br/>' +
    '<p>Please click <a href='+ verifyUrl +'/user/verify/'+ verificationId +'>HERE</a> ' +
    'to confirm your email address.</p><br/>' +
    '<p>Thanks,</p>' + '<p>The thumb Team</p>';
    const subject = 'Verify your Thumb Account';
    const from = 'confirmation@thumbtravel.com';
    const scheduledTime = new Date();
    return new Email(scheduledTime, from, toEmailAddress, subject, emailBody);
  }
}
