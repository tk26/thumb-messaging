const chai = require('chai');
const should = chai.should();
const moment = require('moment');

const messageDB = require('../../src/db/message-db.js');
const Message = require('../../src/domain/Message.js');
const Email = require('../../src/domain/delivery_methods/Email');
const PushNotification = require('../../src/domain/delivery_methods/PushNotification');
const uuid = require('uuid/v1');
const neo4j = require('../../src/drivers/neo4jDriver.js');

const fakeUserId = uuid();

const addUser = async() => {
  let query = 'CREATE (u:User{userId: {userId}})';
  try {
    return await neo4j.execute(query,{userId: fakeUserId});
  } catch (err){
    throw err;
  }
}

const deleteUser = async() => {
  let query = 'MATCH(u:User{userId: {userId}}) DETACH DELETE u';
  try {
    return await neo4j.execute(query,{userId: fakeUserId});
  } catch (err){
    throw err;
  }
}

describe('MessageDB', () => {
  before(async() => {
    await addUser();
  });
  after(async() => {
    await deleteUser();
  });

  describe('saveMessage', () => {
    it('should save successfully when provided valid message with email delivery method', async() => {
      const userId = fakeUserId;
      const messageId = uuid();
      const message = new Message({
        messageId: messageId,
        toUserId: userId,
        messageType: 'Test',
        messageParameters: {}
      });
      const deliveryMethod = new Email(new Date(), 'from@test.com', 'to@test.com', 'test-subject', 'test-body');
      message.deliveryMethods.push(deliveryMethod);
      await messageDB.saveMessage(message);
      await messageDB.deleteMessage(message.messageId);
    });
    it('should save successfully when provided valid message with push notification delivery method', async() => {
      const userId = fakeUserId;
      const messageId = uuid();
      const message = new Message({
        messageId: messageId,
        toUserId: userId,
        messageType: 'Test',
        messageParameters: {}
      });
      const deliveryMethod = new PushNotification(new Date(), 'Expo[asfdasd]', 'default', 'testTitle', 'This is a test message.', {});
      message.deliveryMethods.push(deliveryMethod);
      await messageDB.saveMessage(message);
      await messageDB.deleteMessage(message.messageId);
    });
    it('should save successfully when provided multiple delivery methods', async() => {
      const userId = fakeUserId;
      const messageId = uuid();
      const message = new Message({
        messageId: messageId,
        toUserId: userId,
        messageType: 'Test',
        messageParameters: {}
      });
      const emailDeliveryMethod = new Email(new Date(), 'from@test.com', 'to@test.com', 'test-subject', 'test-body');
      message.deliveryMethods.push(emailDeliveryMethod);
      const pushNotificationDeliveryMethod = new PushNotification(new Date(), 'Expo[asfdasd]', 'default', 'testTitle', 'This is a test message.', {});
      message.deliveryMethods.push(pushNotificationDeliveryMethod);
      await messageDB.saveMessage(message);
      await messageDB.deleteMessage(message.messageId);
    });
  });
  describe('getEmailsToSend', () => {
    const userId = fakeUserId;
    const sentMessage = new Message({
      messageId: uuid(),
      toUserId: userId,
      messageType: 'Test_Sent',
      messageParameters: {}
    });
    const unSentMessage = new Message({
      messageId: uuid(),
      toUserId: userId,
      messageType: 'Test_Unsent',
      messageParameters: {}
    });
    const futureMessage = new Message({
      messageId: uuid(),
      toUserId: userId,
      messageType: 'Test_Future',
      messageParameters: {}
    });
    const sentDeliveryMethod = new Email(new Date(), 'from@test.com', 'to@test.com', 'test-subject', 'test-body');
    const unSentDeliveryMethod = new Email(new Date(), 'from@test.com', 'to@test.com', 'test-subject', 'test-body');

    const futureScheduledTime = moment(new Date().getTime())
      .add(60, 'm')
      .toDate();
    const futureDeliveryMethod = new Email(futureScheduledTime,'from@test.com', 'to@test.com', 'test-subject', 'test-body');

    before(async() => {
      sentMessage.deliveryMethods.push(sentDeliveryMethod);
      unSentMessage.deliveryMethods.push(unSentDeliveryMethod);
      futureMessage.deliveryMethods.push(futureDeliveryMethod);
      await messageDB.saveMessage(sentMessage);
      await messageDB.saveEmailSendResult({message: {emailId: sentDeliveryMethod.deliveryMethodId}, response: {status: 'ok', error: ''}});
      await messageDB.saveMessage(unSentMessage);
      await messageDB.saveMessage(futureMessage);
    });
    after(async() => {
      await messageDB.deleteMessage(sentMessage.messageId);
      await messageDB.deleteMessage(unSentMessage.messageId);
      await messageDB.deleteMessage(futureMessage.messageId);
    })
    it('should only return unsent messages with a scheduled delivery date <= current date', async() => {
      let results = await messageDB.getEmailsToSend();
      let sentResults = results.find((element) => {
        return element.emailId === sentDeliveryMethod.deliveryMethodId;
      });
      let unSentResults = results.find((element) => {
        return element.emailId === unSentDeliveryMethod.deliveryMethodId;
      });
      let futureUnsentResults = results.find((element) => {
        return element.emailId === futureDeliveryMethod.deliveryMethodId;
      });
      unSentResults.emailId.should.equal(unSentDeliveryMethod.deliveryMethodId,"Expected the unsent message with a scheduled delivery date <= now to be returned");
      chai.expect(sentResults).to.equal(undefined,"Expected no messages that have already been sent to be returned.");
      chai.expect(futureUnsentResults).to.equal(undefined,"Expected no messages with a future scheduled delivery date to be returned.");
    });
  });

  describe('getPushNotificationsToSend', () => {
    const userId = fakeUserId;
    const sentMessage = new Message({
      messageId: uuid(),
      toUserId: userId,
      messageType: 'Test_Sent',
      messageParameters: {}
    });
    const unSentMessage = new Message({
      messageId: uuid(),
      toUserId: userId,
      messageType: 'Test_Unsent',
      messageParameters: {}
    });
    const futureMessage = new Message({
      messageId: uuid(),
      toUserId: userId,
      messageType: 'Test_Future',
      messageParameters: {}
    });
    const sentDeliveryMethod = new PushNotification(new Date(), 'testtoken', 'default', 'testTitle', 'this is a test message', {});
    const unSentDeliveryMethod = new PushNotification(new Date(), 'testtoken', 'default', 'testTitle', 'this is a test message', {});

    const futureScheduledTime = moment(new Date().getTime())
      .add(60, 'm')
      .toDate();
    const futureDeliveryMethod = new PushNotification(futureScheduledTime, 'testtoken', 'default', 'testTitle', 'this is a test message', {});

    before(async() => {
      sentMessage.deliveryMethods.push(sentDeliveryMethod);
      unSentMessage.deliveryMethods.push(unSentDeliveryMethod);
      futureMessage.deliveryMethods.push(futureDeliveryMethod);
      await messageDB.saveMessage(sentMessage);
      await messageDB.savePushNotificationSendResult({message: {pushNotificationId: sentDeliveryMethod.deliveryMethodId}, response: {status: 'ok', error: '', errorType: ''}});
      await messageDB.saveMessage(unSentMessage);
      await messageDB.saveMessage(futureMessage);
    });
    after(async() => {
      await messageDB.deleteMessage(sentMessage.messageId);
      await messageDB.deleteMessage(unSentMessage.messageId);
      await messageDB.deleteMessage(futureMessage.messageId);
    })
    it('should only return unsent messages with a scheduled delivery date <= current date', async() => {
      let results = await messageDB.getPushNotificationsToSend();
      let sentResults = results.find((element) => {
        return element.pushNotificationId === sentDeliveryMethod.deliveryMethodId;
      });
      let unSentResults = results.find((element) => {
        return element.pushNotificationId === unSentDeliveryMethod.deliveryMethodId;
      });
      let futureUnsentResults = results.find((element) => {
        return element.pushNotificationId === futureDeliveryMethod.deliveryMethodId;
      });
      unSentResults.pushNotificationId.should.equal(unSentDeliveryMethod.deliveryMethodId,"Expected the unsent message with a scheduled delivery date <= now to be returned");
      chai.expect(sentResults).to.equal(undefined,"Expected no messages that have already been sent to be returned.");
      chai.expect(futureUnsentResults).to.equal(undefined,"Expected no messages with a future scheduled delivery date to be returned.");
    });
  });
});
