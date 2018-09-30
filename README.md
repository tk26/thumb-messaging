# thumb-messaging
Thumb Messaging service for creating messages for users.

## Getting Started

### Creating a new Message

#### Create new MessageType in MessageTypes.js
Add the message type as a constant in the MessageTypes.js file.

```JavaScript
module.exports = {
  WELCOME_EMAIL: 'WELCOME_EMAIL',
  NEW_FOLLOWER: 'NEW_FOLLOWER',
  ACCOUNT_VERIFICATION: 'ACCOUNT_VERIFICATION',
  PASSWORD_RESET: 'PASSWORD_RESET',
  PASSWORD_RESET_CONFIRMATION: 'PASSWORD_RESET_CONFIRMATION',
  NEW_MESSAGE_TYPE: 'NEW_MESSAGE_TYPE'
};
```
#### Adding an Email Delivery Method
Create a new Email template for the message type.  The template should inherit from EmailTemplate and implement 
two functions (validateMessageParameters and CreateEmail).

```JavaScript
const Email = require('../../domain/delivery_methods/Email');
const EmailTemplate = require('./EmailTemplate.js');

module.exports = class TestEmail extends EmailTemplate {
  /**
   * @param {Object} messageParameters
   * @returns {void}
   */
  static validateMessageParameters(messageParameters){
    super.validateMessageParameters(messageParameters);
    if (!('firstName' in messageParameters))
    {
      throw Error('firstName is a required message param when sending the Welcome Email.');
    }
  }

  /**
   * @param {Object} messageParameters
   * @returns {Email}
   */
  static createEmail(messageParameters){
    const { toEmailAddress, firstName } = messageParameters;
    const emailBody = 'This is a new email!'; 
    const subject = 'Welcome to thumb ' + firstName + '!';
    const from = 'welcome@thumbtravel.com';
    return new Email(scheduledTime, from, toEmailAddress, subject, emailBody);
  }
}
```

#### Adding a Push Notification Delivery Method
Create a new Push template for the message type.  The template should inherit from EmailTemplate and implement 
two functions (validateMessageParameters and CreateEmail).

```JavaScript
const PushTemplate = require('./PushTemplate');
const PushNotification = require('../../domain/delivery_methods/PushNotification');

module.exports = class NewFollower extends PushTemplate {
  /**
   * @param {Object} messageParameters
   * @returns {void}
   */
  static validateMessageParameters(messageParameters){
    super.validateMessageParameters(messageParameters);
    if (!('username' in messageParameters))
    {
      throw Error('username is a required message param when sending a new follower push notification.');
    }
  }

  /**
   * @param {Object} messageParameters
   * @returns {PushNotification}
   */
  static createPushNotification(messageParameters){
    const { pushToken, username } = messageParameters;
    const deliveryTime = new Date();
    const sound = 'default';
    const body = username + ' started following you.';
    const title = '';
    const data = {};
    return new PushNotification(deliveryTime, pushToken, sound, title, body, data);
  }
}
```

#### Using the message in application code
Construct a new message object, add the delivery methods, and then save.

```JavaScript
const { Message, MessageTypes } = require('thumb-messaging');

let message = new Message({
  toUserId: userId,
  messageType: MessageTypes.NEW_MESSAGE_TYPE,
  messageParameters: {
    pushToken: expoToken,
    username: fromUsername,
    toEmailAddress: 'testEmail@test.edu'
  }
});
message.addEmailDeliveryMethod();
message.addPushNotificationDeliveryMethod();
await message.save();
```      


### Branching

#### master
Contains all the stable, released code.

#### Conventions
Branch names should be sensible, concise and self-explanatory.
Should begin with the following texts:
New Features- "feature-"
Bugs- "bug-"
Improvements- "improvement-"

### Pull Request Process
Should create a pull request against feature branch.
Commits should be sensible, concise and self-explanatory.
Should pass all the existing tests.
New features should be shipped along with the tests.
Should include updates to README or any other documentation files if needed.
