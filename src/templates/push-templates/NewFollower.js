const PushTemplate = require('./PushTemplate');
const PushNotification = require('../../domain/delivery_methods/PushNotification');

module.exports = class NewFollower extends PushTemplate {
  /**
   * @param {Object} messageParameters
   * @returns {void}
   */
  static validateMessageParameters(messageParameters){
    super.validateMessageParameters(messageParameters);
    if (!('username' in messageParameters))
    {
      throw Error('username is a required message param when sending a new follower push notification.');
    }
  }

  /**
   * @param {Object} messageParameters
   * @returns {PushNotification}
   */
  static createPushNotification(messageParameters){
    const { pushToken, username } = messageParameters;
    const deliveryTime = new Date();
    const sound = 'default';
    const body = username + ' started following you.';
    const title = '';
    const data = {};
    return new PushNotification(deliveryTime, pushToken, sound, title, body, data);
  }
}
