const chai = require('chai');
const should = chai.should();
const uuid = require('uuid/v1');

const { WELCOME_EMAIL, ACCOUNT_VERIFICATION, PASSWORD_RESET, PASSWORD_RESET_CONFIRMATION } = require('../../src/domain/MessageTypes.js');
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
  describe(ACCOUNT_VERIFICATION, () => {
    it('should successfully send verification email when provided valid message parameters',async() => {
      let verificationMessage = new Message({
        messageType: ACCOUNT_VERIFICATION,
        toUserId: fakeUserId,
        messageParameters: {
          toEmailAddress: testEmail,
          verificationId: 'asdfasdf',
          verifyUrl: 'verify.thumbtravel.com'
        }
      });
      verificationMessage.addEmailDeliveryMethod();
      await verificationMessage.save();
      await MessageDeliveryService.processEmails();
    });
  });
  describe(PASSWORD_RESET, () => {
    it('should successfully send password reset email when provided valid message parameters',async() => {
      let resetEmail = new Message({
        messageType: PASSWORD_RESET,
        toUserId: fakeUserId,
        messageParameters: {
          toEmailAddress: testEmail,
          resetToken: 'asdfas',
          resetBaseUrl: 'reset.thumbtravel.com'
        }
      });
      resetEmail.addEmailDeliveryMethod();
      await resetEmail.save();
      await MessageDeliveryService.processEmails();
    });
  });
  describe(PASSWORD_RESET_CONFIRMATION, () => {
    it('should successfully send password reset confirmation email when provided valid message parameters',async() => {
      let resetConfirmation = new Message({
        messageType: PASSWORD_RESET_CONFIRMATION,
        toUserId: fakeUserId,
        messageParameters: {
          toEmailAddress: testEmail,
          resetBaseUrl: 'reset.thumbtravel.com'
        }
      });
      resetConfirmation.addEmailDeliveryMethod();
      await resetConfirmation.save();
      await MessageDeliveryService.processEmails();
    });
  });
});
