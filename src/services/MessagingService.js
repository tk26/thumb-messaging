const emailTemplates = require('../templates/email-templates');
const pushTemplates = require('../templates/push-templates');
const { Email, PushNotification } = require('../domain');

/**
 * @param {String} messageType
 * @param {Object} messageParameters
 * @returns {Email}
 */
exports.createEmail = (messageType, messageParameters) => {
  if((!(messageType in emailTemplates))){
    throw new TypeError("An email template was not found for " + messageType);
  }
  let template = emailTemplates[messageType];
  template.validateMessageParameters(messageParameters);
  return template.createEmail(messageParameters);
}

/**
 * @param {String} messageType
 * @param {Object} messageParameters
 * @returns {PushNotification}
 */
exports.createPushNotification = (messageType, messageParameters) => {
  if((!(messageType in pushTemplates))){
    throw new TypeError("A push template was not found for " + messageType);
  }
  let template = pushTemplates[messageType];
  template.validateMessageParameters(messageParameters);
  return template.createPushNotification(messageParameters);
}
