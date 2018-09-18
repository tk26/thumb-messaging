const chai = require('chai');
const should = chai.should();
const uuid = require('uuid/v1');

const { NEW_FOLLOWER } = require('../../src/domain/MessageTypes.js');
const Message = require('../../src/domain/Message.js');
const MessageDeliveryService = require('../../src/services/MessageDeliveryService.js');

const dbUtils = require('../utilities/db-utils.js');

const testPushToken = 'ExponentPushToken[D7NYfBPGyyRIx2H0IQ6BDK]';
const fakeUserId = uuid();

describe('PushNotifications', () => {
  before(async() => {
    dbUtils.addUser(fakeUserId);
  });
  after(async() => {
    dbUtils.deleteUser(fakeUserId);
  });

  describe('NEW_FOLLOWER', () => {
    it('should successfully push NEW_FOLLOWER push notification when provided valid message parameters',async() => {
      let newFollowerMessage = new Message({
        messageType: NEW_FOLLOWER,
        toUserId: fakeUserId,
        messageParameters: {
          pushToken: testPushToken,
          username: 'test_username'
        }
      });
      newFollowerMessage.addPushNotificationDeliveryMethod();
      await newFollowerMessage.save();
      await MessageDeliveryService.processPushNotifications();
    });
  });
});
