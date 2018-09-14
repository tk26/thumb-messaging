const chai = require('chai');
const should = chai.should();

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
      const deliveryMethod = new PushNotification(new Date(), 'Expo[asfdasd]', 'default', 'This is a test message.', {});
      message.deliveryMethods.push(deliveryMethod);
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
    const sentDeliveryMethod = new Email(new Date(), 'from@test.com', 'to@test.com', 'test-subject', 'test-body');
    const unSentDeliveryMethod = new Email(new Date(), 'from@test.com', 'to@test.com', 'test-subject', 'test-body');
    before(async() => {
      sentMessage.deliveryMethods.push(sentDeliveryMethod);
      unSentMessage.deliveryMethods.push(unSentDeliveryMethod);
      await messageDB.saveMessage(sentMessage);
      await messageDB.setEmailSent(sentDeliveryMethod.deliveryMethodId);
      await messageDB.saveMessage(unSentMessage);
    });
    after(async() => {
      await messageDB.deleteMessage(sentMessage.messageId);
      await messageDB.deleteMessage(unSentMessage.messageId);
    })
    it('should only return unsent messages', async() => {
      let results = await messageDB.getEmailsToSend();
      let sentResults = results.find((element) => {
        return element.emailId === sentDeliveryMethod.deliveryMethodId;
      });
      let unSentResults = results.find((element) => {
        return element.emailId === unSentDeliveryMethod.deliveryMethodId;
      });
      unSentResults.emailId.should.equal(unSentDeliveryMethod.deliveryMethodId);
      chai.expect(sentResults).to.equal(undefined);
    });
  });
});
