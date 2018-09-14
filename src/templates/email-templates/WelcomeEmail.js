const Email = require('../../domain/delivery_methods/Email');
const EmailTemplate = require('./EmailTemplate.js');
const moment = require('moment');
const config = require('../../../config.js');

module.exports = class WelcomeEmail extends EmailTemplate {
  /**
   * @param {Object} messageParameters
   * @returns {void}
   */
  static validateMessageParameters(messageParameters){
    super.validateMessageParameters(messageParameters);
    if (!('firstName' in messageParameters))
    {
      throw Error('firstName is a required message param when sending the Welcome Email.');
    }
  }

  /**
   * @param {Object} messageParameters
   * @returns {Email}
   */
  static createEmail(messageParameters){
    const { toEmailAddress, firstName } = messageParameters;
    let welcomeEmailBody = '<p><b>thumb is more than just a ride.</b></p>';
    welcomeEmailBody = welcomeEmailBody + '<p>Start a trip as a rider or driver, or browse and see where your friends are ';
    welcomeEmailBody = welcomeEmailBody + 'before they go.  thumb is where your past travel becomes concrete and your future ';
    welcomeEmailBody = welcomeEmailBody + 'travel becomes attainable.</p>';
    const subject = 'Welcome to thumb ' + firstName + '!';
    const from = 'welcome@thumbtravel.com';
    const scheduledTime = moment(new Date().getTime())
      .add(config.APP_SETTINGS.WELCOME_EMAIL_MINUTE_DELAY, 'm')
      .toDate();
    return new Email(scheduledTime, from, toEmailAddress, subject, welcomeEmailBody);
  }
}
