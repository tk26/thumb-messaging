const DeliveryMethod = require('./DeliveryMethod.js');

module.exports = class PushNotification extends DeliveryMethod {
  /**
   * @param {Date} scheduledDeliveryTime
   * @param {String} pushToken
   * @param {String} sound
   * @param {String} title
   * @param {String} body
   * @param {Object} data
   * @returns {PushNotification}
   */
  constructor(scheduledDeliveryTime, pushToken, sound, title, body, data){
    super('PushNotification', scheduledDeliveryTime);
    this.pushToken = pushToken;
    this.sound = sound;
    this.title = title;
    this.body = body;
    this.data = data;
  }
}
