const messageDB = require('../db/message-db.js');
const EmailClient = require('../clients/EmailClient.js');
const PushNotificationClient = require('../clients/PushNotificationClient.js');

module.exports = class MessageDeliveryService {
  static async processEmails(){
    const emailClient = new EmailClient();
    let continueSending = true;

    while(continueSending){
      let messages = await messageDB.getEmailsToSend();

      if(messages.length === 0){
        continueSending = false;
      } else {
        for(let i in messages){
          const message = messages[i];
          try{
            const result = await emailClient.sendMessage(message);
            await messageDB.saveEmailSendResult(result);
          } catch(err){
            //need to add logger
            console.log(err);
          }
        }
      }
    }
  }

  static async processPushNotifications(){
    const pushNotificationClient = new PushNotificationClient();
    let continueSending = true;

    while(continueSending){
      let messages = await messageDB.getPushNotificationsToSend();
      if(messages.length === 0){
        continueSending = false;
      } else {
        try{
          let results = await pushNotificationClient.sendMessages(messages);
          await processPushNotificationSendResults(results);
        } catch(err){
          console.log(err);
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
      console.log(err);
    }
  }
}
