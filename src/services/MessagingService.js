const { WelcomeEmail } = require('../templates');
const { MessageTypes, Email, PushNotification } = require('../domain');

module.exports = class MessagingService {
  /**
   * @param {String} messageType
   * @param {Object} messageParameters
   * @returns {Email}
   */
  static createEmail(messageType, messageParameters){
    const { WELCOME_EMAIL } = MessageTypes;
    let template;
    switch (messageType){
      case WELCOME_EMAIL:
        template = WelcomeEmail;
        break;
      default:
        return null;
    }
    template.validateMessage(messageParameters);
    return template.createEmail(messageParameters);
  }

  /**
   * @param {String} messageType
   * @param {Object} messageParameters
   * @returns {PushNotification}
   */
  static createPushNotification(messageType, messageParameters){
    return new PushNotification();
  }
}
