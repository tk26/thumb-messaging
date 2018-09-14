module.exports = class PushTemplate{
  static validateMessageParameters(messageParameters){
    if(!messageParameters){
      throw Error('The message is missing message parameters.');
    }
    if (!('pushToken' in messageParameters))
    {
      throw Error('pushToken is a required message param when sending a push notification.');
    }
  }
}
