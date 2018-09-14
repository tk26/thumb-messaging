const Message = require('./Message.js');
const MessageTypes = require('./MessageTypes.js');
const Email = require('./delivery_methods/Email');
const PushNotification = require('./delivery_methods/PushNotification');

module.exports = {
  Message: Message,
  MessageTypes: MessageTypes,
  Email: Email,
  PushNotification: PushNotification
}
