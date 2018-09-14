const uuid = require('uuid/v1');

module.exports = class DeliveryMethod{
  constructor(type, scheduledDeliveryTime, deliveryMethodId = uuid()){
    this.deliveryMethodId = deliveryMethodId;
    this.type = type;
    this.scheduledDeliveryTime = scheduledDeliveryTime;
  }
}
