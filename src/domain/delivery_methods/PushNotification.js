const DeliveryMethod = require('./DeliveryMethod.js');

module.exports = class PushNotification extends DeliveryMethod {
  /**
   * @param {Date} scheduledDeliveryTime
   * @param {String} pushToken
   * @param {String} sound
   * @param {String} body
   * @param {Object} data
   * @returns {PushNotification}
   */
  constructor({scheduledDeliveryTime, pushToken, sound, body, data }){
    super(scheduledDeliveryTime);
    this.pushToken = pushToken;
    this.sound = sound;
    this.body = body;
    this.data = data;
  }
}
