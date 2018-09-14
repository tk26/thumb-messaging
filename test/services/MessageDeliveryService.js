const chai = require('chai');
const should = chai.should();

let sinon = require('sinon');

describe.only('MessageDeliveryService', () => {
  describe('processEmails', () => {
    it('should send emails and mark as sent when an email is unsent',async() => {
      const messageDB = require('../../src/db/message-db.js');
      sinon.stub(messageDB, 'getEmailsToSend')
        .onFirstCall().returns([{
          emailId: '123',
          from: 'from@test.com',
          to: 'jromines@gmail.com',
          subject: 'test subject',
          body: '<html><body><p>testing</p></body></html>'}]
        )
        .onSecondCall().returns([]);
      sinon.stub(messageDB, 'setEmailSent').callsFake(async() =>{
        return;
      });
      const MessageDeliveryService = require('../../src/services/MessageDeliveryService.js');
      await MessageDeliveryService.processEmails();
    });
  });
  describe('processPushNotifications', () => {
    it('should send push notifications and mark as sent when a push notification is unsent',async() => {
      const messageDB = require('../../src/db/message-db.js');
      sinon.stub(messageDB, 'getPushNotificationsToSend')
        .onFirstCall().returns([{
          pushNotificationId: '123',
          pushToken: 'ExponentPushToken[D7NYfBPGyyRIx2H0IQ6BDK]',
          sound: 'default',
          body: 'testing push notifications',
          data: {}}]
        )
        .onSecondCall().returns([]);
      sinon.stub(messageDB, 'setPushNotificationSent').callsFake(async() =>{
        return;
      });
      const MessageDeliveryService = require('../../src/services/MessageDeliveryService.js');
      await MessageDeliveryService.processPushNotifications();
    });
  });
});
