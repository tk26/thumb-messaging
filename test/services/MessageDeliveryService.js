const chai = require('chai');
const should = chai.should();

let sinon = require('sinon');
const { NEW_FOLLOWER } = require('../../src/domain/MessageTypes.js');
const MessagingService = require('../../src/services/MessagingService.js');

describe('MessageDeliveryService', () => {
  describe('processEmails', () => {
    it('should send emails and mark as sent when an email is unsent',async() => {
      const messageDB = require('../../src/db/message-db.js');
      const getStub = sinon.stub(messageDB, 'getEmailsToSend')
        .onFirstCall().returns([{
          emailId: '123',
          from: 'from@test.com',
          to: 'jromines@gmail.com',
          subject: 'test subject',
          body: '<html><body><p>testing</p></body></html>'}]
        )
        .onSecondCall().returns([]);
      const saveResultStub = sinon.stub(messageDB, 'saveEmailSendResult').callsFake(async() =>{
        return;
      });
      const MessageDeliveryService = require('../../src/services/MessageDeliveryService.js');
      await MessageDeliveryService.processEmails();
      saveResultStub.callCount.should.equal(1);
      getStub.restore();
      saveResultStub.restore();
    });
  });
  describe.only('processPushNotifications', () => {
    it('should send push notifications and mark as sent when a push notification is unsent',async() => {
      const messageDB = require('../../src/db/message-db.js');
      const newFollowerPushNotification = MessagingService.createPushNotification(NEW_FOLLOWER, {pushToken: 'ExponentPushToken[D7NYfBPGyyRIx2H0IQ6BDK]', username:'test_username'});
      const getStub = sinon.stub(messageDB, 'getPushNotificationsToSend')
        .onFirstCall().returns([
          {
            pushNotificationId: newFollowerPushNotification.pushNotificationId,
            pushToken: newFollowerPushNotification.pushToken,
            sound: newFollowerPushNotification.sound,
            title: newFollowerPushNotification.title,
            body: newFollowerPushNotification.body,
            data: JSON.stringify(newFollowerPushNotification.data)
          },
          {
            pushNotificationId: '125',
            pushToken: 'ExponentPushToken[D7NYfBPGyyRIx2H0IQ6BDK]',
            sound: 'default',
            title: 'Test Message 2',
            body: 'testing push notifications - 2',
            data: '{}'
          },
          {
            pushNotificationId: '126',
            pushToken: 'ExponentPushToken[faketoken]',
            sound: 'default',
            title: 'Test Message 3',
            body: 'testing push notifications - 3',
            data: '{}'
          }
        ])
        .onSecondCall().returns([]);
      const saveResultStub = sinon.stub(messageDB, 'savePushNotificationSendResult').callsFake(async(result) =>{
        return result;
      });
      const MessageDeliveryService = require('../../src/services/MessageDeliveryService.js');
      await MessageDeliveryService.processPushNotifications();
      saveResultStub.callCount.should.equal(3);
      getStub.restore();
      saveResultStub.restore();
    });
  });
});
