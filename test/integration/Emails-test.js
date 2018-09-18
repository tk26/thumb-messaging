const chai = require('chai');
const should = chai.should();
const uuid = require('uuid/v1');

const { WELCOME_EMAIL } = require('../../src/domain/MessageTypes.js');
const Message = require('../../src/domain/Message.js');
const MessageDeliveryService = require('../../src/services/MessageDeliveryService.js');

const dbUtils = require('../utilities/db-utils.js');

const testEmail = 'jromines@gmail.com';
const fakeUserId = uuid();

describe('Emails', () => {
  before(async() => {
    dbUtils.addUser(fakeUserId);
  });
  after(async() => {
    dbUtils.deleteUser(fakeUserId);
  });

  describe(WELCOME_EMAIL, () => {
    it('should successfully send welcome email when provided valid message parameters',async() => {
      let welcomeMessage = new Message({
        messageType: WELCOME_EMAIL,
        toUserId: fakeUserId,
        messageParameters: {
          toEmailAddress: testEmail,
          firstName: 'Josh'
        }
      });
      welcomeMessage.addEmailDeliveryMethod();
      await welcomeMessage.save();
      await MessageDeliveryService.processEmails();
    });
  });
});
