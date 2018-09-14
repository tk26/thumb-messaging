const chai = require('chai');
const MessagingService = require('../../src/services/MessagingService.js');
const should = chai.should();
const  MessageTypes  = require('../../src/domain/MessageTypes.js');


describe('MessagingService', () => {
  describe('createEmail', () => {
    it('should return welcome email when provided correct type and params',() => {
      const messageParameters = {
        toEmailAddress: 'jromine@gmail.com',
        firstName: 'Josh'
      };
      const email = MessagingService.createEmail(MessageTypes.WELCOME_EMAIL, messageParameters);
      email.from.should.equal('welcome@thumbtravel.com');
      email.to.should.equal(messageParameters.toEmailAddress);
      email.subject.should.contain(messageParameters.firstName);
      email.body.should.not.equal(null);
      email.body.should.not.equal(undefined);
    });
  });
});
