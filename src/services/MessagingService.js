const { WelcomeEmail } = require('../templates/email-templates');
const { NewFollower } = require('../templates/push-templates');
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
    template.validateMessageParameters(messageParameters);
    return template.createEmail(messageParameters);
  }

  /**
   * @param {String} messageType
   * @param {Object} messageParameters
   * @returns {PushNotification}
   */
  static createPushNotification(messageType, messageParameters){
    const { NEW_FOLLOWER } = MessageTypes;
    let template;
    switch (messageType){
      case NEW_FOLLOWER:
        template = NewFollower;
        break;
      default:
        return null;
    }
    template.validateMessageParameters(messageParameters);
    return template.createPushNotification(messageParameters);
  }
}
