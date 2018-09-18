const { Expo } = require('expo-server-sdk');

module.exports = class PushNotificationClient{
  constructor(){
    this.expo = new Expo();
  }
  async sendMessages(messages){
    let responses = [];
    const convertedResult = convertMessagesForExpo(messages);
    let chunks = this.expo.chunkPushNotifications(convertedResult.convertedMessages);
    // Send the chunks to the Expo push notification service.
    for (let chunk of chunks) {
      try {
        let responseChunk = await this.expo.sendPushNotificationsAsync(chunk);
        responses.push(...createResponses(chunk,responseChunk));
      } catch (error) {
        console.error(error);
      }
    }
    responses.push(...convertedResult.failedMessages);
    return responses;
  }
}

const convertMessagesForExpo = (messages) => {
  let convertedMessages = [];
  let failedMessages = [];
  for (let message of messages) {
    // Check that all your push tokens appear to be valid Expo push tokens
    if (!Expo.isExpoPushToken(message.pushToken)) {
      failedMessages.push({
        message: message,
        response: {
          status: 'error',
          error: `Push token ${message.pushToken} is not a valid Expo push token`,
          errorType: 'Invalid Push Token'
        }
      })
      continue;
    }

    let data = JSON.parse(message.data);
    let convertedMessage = {
      pushNotificationId: message.pushNotificationId,
      to: message.pushToken,
      sound: message.sound,
      body: message.body,
      data: data
    };

    //conditionally add title
    if (message.title && message.title !== ''){
      convertedMessage.title = message.title;
    }

    // Construct a message (see https://docs.expo.io/versions/latest/guides/push-notifications.html)
    convertedMessages.push(convertedMessage);
  }

  return {
    convertedMessages,
    failedMessages
  };
}

const createResponses = (messages, rawResponses) => {
  let responses = [];
  for(let i in rawResponses){
    let errorMessage = '', errorType = '';
    if(rawResponses[i].status === 'error'){
      errorMessage = rawResponses[i].message;
      errorType = rawResponses[i].details.error ? rawResponses[i].details.error : '';
    }
    let response = {
      message: messages[i],
      response: {
        status: rawResponses[i].status,
        error: errorMessage,
        errorType: errorType
      }
    }
    responses.push(response);
  }
  return responses;
}
