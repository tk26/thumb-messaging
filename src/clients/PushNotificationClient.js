const { Expo } = require('expo-server-sdk');

module.exports = class PushNotificationClient{
  constructor(){
    this.expo = new Expo();
  }
  async sendMessages(messages){
    const convertedMessages = convertMessagesForExpo(messages);
    let chunks = this.expo.chunkPushNotifications(convertedMessages);
    let tickets = [];
    // Send the chunks to the Expo push notification service.
    for (let chunk of chunks) {
      try {
        console.log(chunk);
        let ticketChunk = await this.expo.sendPushNotificationsAsync(chunk);
        console.log(ticketChunk);
        tickets.push(...ticketChunk);
      } catch (error) {
        console.error(error);
      }
    }
    return tickets;
  }
}

const convertMessagesForExpo = (messages) => {
  let convertedMessages = [];
  for (let message of messages) {
    // Check that all your push tokens appear to be valid Expo push tokens
    if (!Expo.isExpoPushToken(message.pushToken)) {
      console.error(`Push token ${message.pushToken} is not a valid Expo push token`);
      continue;
    }

    // Construct a message (see https://docs.expo.io/versions/latest/guides/push-notifications.html)
    convertedMessages.push({
      pushNotificationId: message.pushNotificationId,
      to: message.pushToken,
      sound: message.sound,
      body: message.body,
      data: message.data
    });
  }

  return convertedMessages;
}
