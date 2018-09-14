let uuid = require('uuid/v1');
const MessagingService = require('../services/MessagingService.js');
const messageDB = require('../db/message-db.js');

module.exports = class Message{
  constructor({ messageId = uuid(), toUserId, messageType, messageParameters, createdDate = new Date() }){
    this.messageId = messageId;
    this.toUserId = toUserId;
    this.messageType = messageType;
    this.messageParameters = messageParameters;
    this.createdDate = createdDate;
    this.deliveryMethods = [];
  }

  addEmailDeliveryMethod(){
    const email = MessagingService.createEmail(this.messageType, this.messageParameters);
    this.deliveryMethods.push(email);
  }

  addPushNotificationDeliveryMethod(){
    const notification = MessagingService.createPushNotification(this.messageType, this.messageParameters);
    this.deliveryMethods.push(notification);
  }

  async save(){
    await messageDB.saveMessage(this);
  }
}
