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
            await emailClient.sendMessage(message.from, message.to, message.subject, message.body);
            await messageDB.setEmailSent(message.emailId);
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
        let responses = await pushNotificationClient.sendMessages(messages);
        console.log(responses);
      }
    }
  }
}

