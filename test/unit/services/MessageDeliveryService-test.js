const chai = require('chai');
const should = chai.should();
const sinon = require('sinon');

describe('MessageDeliveryService', () => {
  describe('processEmails', () => {
    it('should log error and exit when exception is thrown getting emails to send',async() => {
      const messagesDB = require('../../../src/db/message-db.js');
      const getEmailsStub = sinon.stub(messagesDB, 'getEmailsToSend').throws();
      const logger = require('thumb-logger').getLogger('MessageServiceLog');
      const loggerStub = sinon.stub(logger, 'error');
      const deliveryService = require('../../../src/services/MessageDeliveryService.js')
      await deliveryService.processEmails();
      chai.assert(getEmailsStub.calledOnce);
      chai.assert(loggerStub.calledOnce);
      getEmailsStub.restore();
      loggerStub.restore();
    });
    it('should save error result and log error when exception is encountered sending email',async() => {
      const messagesDB = require('../../../src/db/message-db.js');
      const getEmailsStub = sinon.stub(messagesDB, 'getEmailsToSend')
        .onFirstCall().returns([{
            emailId: '123',
            from: 'from@test.com',
            to: 'jromines@gmail.com',
            subject: 'test subject',
            body: '<html><body><p>testing</p></body></html>'}
        ])
        .onSecondCall().returns([]);
      const saveResultStub = sinon.stub(messagesDB, 'saveEmailSendResult');

      const logger = require('thumb-logger').getLogger('MessageServiceLog');
      const loggerStub = sinon.stub(logger, 'error');

      const emailClient = require('../../../src/clients/EmailClient.js');
      const emailClientStub = sinon.stub(emailClient, 'sendMessage').throws();

      const deliveryService = require('../../../src/services/MessageDeliveryService.js')
      await deliveryService.processEmails();
      chai.assert(getEmailsStub.calledTwice);
      chai.assert(loggerStub.calledOnce);
      chai.assert(emailClientStub.calledOnce);
      chai.assert(saveResultStub.calledOnce);
      getEmailsStub.restore();
      loggerStub.restore();
      saveResultStub.restore();
      emailClientStub.restore();
    });
    it('should save error result and log error when exception is encountered saving error result',async() => {
      const messagesDB = require('../../../src/db/message-db.js');
      const getEmailsStub = sinon.stub(messagesDB, 'getEmailsToSend')
        .onFirstCall().returns([{
            emailId: '123',
            from: 'from@test.com',
            to: 'jromines@gmail.com',
            subject: 'test subject',
            body: '<html><body><p>testing</p></body></html>'},
            {
              emailId: '124',
              from: 'from@test.com',
              to: 'jromines@gmail.com',
              subject: 'test subject',
              body: '<html><body><p>testing</p></body></html>'
            }
        ])
        .onSecondCall().returns([]);
      const saveResultStub = sinon.stub(messagesDB, 'saveEmailSendResult')
        .onFirstCall().throws();

      const logger = require('thumb-logger').getLogger('MessageServiceLog');
      const loggerStub = sinon.stub(logger, 'error');

      const emailClient = require('../../../src/clients/EmailClient.js');
      const emailClientStub = sinon.stub(emailClient, 'sendMessage').returns({
        message: {},
        response: {
          status: 'ok',
          error: ''
        }});

      const deliveryService = require('../../../src/services/MessageDeliveryService.js')
      await deliveryService.processEmails();
      chai.assert(getEmailsStub.calledTwice);
      chai.assert(loggerStub.calledOnce);
      //Called to send both emails
      chai.assert(emailClientStub.calledTwice);
      //Called a second time after first error and then a third time for the second email
      chai.assert(saveResultStub.calledThrice);
      getEmailsStub.restore();
      loggerStub.restore();
      saveResultStub.restore();
      emailClientStub.restore();
    });
  });

  describe('processPushNotifications', () => {
    it('should log error and exit when exception is thrown getting push notifications to send',async() => {
      const messagesDB = require('../../../src/db/message-db.js');
      const getNotificationsStub = sinon.stub(messagesDB, 'getPushNotificationsToSend').throws();
      const logger = require('thumb-logger').getLogger('MessageServiceLog');
      const loggerStub = sinon.stub(logger, 'error');
      const deliveryService = require('../../../src/services/MessageDeliveryService.js')
      await deliveryService.processPushNotifications();
      chai.assert(getNotificationsStub.calledOnce);
      chai.assert(loggerStub.calledOnce);
      getNotificationsStub.restore();
      loggerStub.restore();
    });
    it('should save error result and log error when exception is encountered sending push notification',async() => {
      const messagesDB = require('../../../src/db/message-db.js');
      const getNotificationsStub = sinon.stub(messagesDB, 'getPushNotificationsToSend')
        .onFirstCall().returns([{
          pushNotificationId: '125',
          pushToken: 'ExponentPushToken[D7NYfBPGyyRIx2H0IQ6BDK]',
          sound: 'default',
          title: 'Test Message 2',
          body: 'testing push notifications',
          data: '{}'
        }])
        .onSecondCall().returns([]);

      const pushNotificationClient = require('../../../src/clients/PushNotificationClient');
      const senderStub = sinon.stub(pushNotificationClient, 'sendMessages').throws();

      const logger = require('thumb-logger').getLogger('MessageServiceLog');
      const loggerStub = sinon.stub(logger, 'error');

      const deliveryService = require('../../../src/services/MessageDeliveryService.js')
      await deliveryService.processPushNotifications();

      chai.assert(getNotificationsStub.calledTwice);
      chai.assert(loggerStub.calledOnce);
      chai.assert(senderStub.calledOnce);
      getNotificationsStub.restore();
      loggerStub.restore();
      senderStub.restore();
    });
    it('should log error when exception is encountered saving send result',async() => {
      const messagesDB = require('../../../src/db/message-db.js');
      const getNotificationsStub = sinon.stub(messagesDB, 'getPushNotificationsToSend')
        .onFirstCall().returns([{
          pushNotificationId: '125',
          pushToken: 'ExponentPushToken[D7NYfBPGyyRIx2H0IQ6BDK]',
          sound: 'default',
          title: 'Test Message 2',
          body: 'testing push notifications',
          data: '{}'
        }])
        .onSecondCall().returns([]);
      const saveResultStub = sinon.stub(messagesDB, 'savePushNotificationSendResult').throws('test error');

      const pushNotificationClient = require('../../../src/clients/PushNotificationClient');
      const senderStub = sinon.stub(pushNotificationClient, 'sendMessages').returns([
        {
          message: {
            pushNotificationId: '125',
            pushToken: 'ExponentPushToken[D7NYfBPGyyRIx2H0IQ6BDK]',
            sound: 'default',
            title: 'Test Message 2',
            body: 'testing push notifications',
            data: '{}'
          },
          response: {
            status: 'ok',
            error: '',
            errorType: ''
          }
        }
      ]);

      const logger = require('thumb-logger').getLogger('MessageServiceLog');
      const loggerStub = sinon.stub(logger, 'error');

      const deliveryService = require('../../../src/services/MessageDeliveryService.js')
      await deliveryService.processPushNotifications();

      chai.assert(getNotificationsStub.calledTwice);
      chai.assert(loggerStub.calledOnceWith('Error saving send result for pushNotificationId: 125 and status: ok and error: .  Error: test error'));
      chai.assert(senderStub.calledOnce);
      chai.assert(saveResultStub.calledOnce);
      getNotificationsStub.restore();
      loggerStub.restore();
      senderStub.restore();
      saveResultStub.restore();
    });
  });
});
