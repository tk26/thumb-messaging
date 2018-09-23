const messageDB = require('../db/message-db.js');
const EmailClient = require('../clients/EmailClient.js');
const PushNotificationClient = require('../clients/PushNotificationClient.js');
const logger = require('thumb-logger').getLogger('MessageServiceLog');

module.exports = class MessageDeliveryService {
  static async processEmails(){
    let continueSending = true;

    while(continueSending){
      let messages = [];
      try {
        messages = await messageDB.getEmailsToSend();
      } catch(err){
        logger.error('Error getting emails to send: ' + err);
        break;
      }

      if(messages.length === 0){
        continueSending = false;
      }
      else {
        for(let i in messages){
          const message = messages[i];
          try{
            let result = await EmailClient.sendMessage(message);
            await messageDB.saveEmailSendResult(result);
          } catch(err){
            let result = {
              message: message,
              response: {
                status: 'error',
                error: err
              }
            };
            await messageDB.saveEmailSendResult(result);
            logger.error('Error processing emails: ' + err);
          }
        }
      }
    }
  }

  static async processPushNotifications(){
    let continueSending = true;

    while(continueSending){
      let messages = [];
      try{
        messages = await messageDB.getPushNotificationsToSend();
      } catch(err){
        logger.error('Error getting push notifications to send: ' + err);
        break;
      }

      if(!messages || messages.length === 0){
        continueSending = false;
      } else {
        try{
          let results = await PushNotificationClient.sendMessages(messages);
          await processPushNotificationSendResults(results);
        } catch(err){
          logger.error('Error processing push notifications: ' + err);
        }
      }
    }
  }
}

const processPushNotificationSendResults = async(results) => {
  for(let result in results){
    try {
      await messageDB.savePushNotificationSendResult(results[result]);
    } catch (err){
      const pushNotificationId = results[result].message.pushNotificationId;
      const { status, error } = results[result].response;
      logger.error('Error saving send result for pushNotificationId: ' + pushNotificationId
        + ' and status: ' + status + ' and error: ' + error + '.  Error: ' + err);
    }
  }
}
