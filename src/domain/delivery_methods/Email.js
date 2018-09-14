const DeliveryMethod = require('./DeliveryMethod.js');

module.exports = class Email extends DeliveryMethod {
  /**
   * @param {Date} scheduledDeliveryTime
   * @param {String} from
   * @param {String} to
   * @param {String} subject
   * @param {String} body
   * @returns {Email}
   */
  constructor(scheduledDeliveryTime, from, to, subject, body){
    super('Email', scheduledDeliveryTime);
    this.from = from;
    this.to = to;
    this.subject = subject;
    this.body = body;
  }
}
