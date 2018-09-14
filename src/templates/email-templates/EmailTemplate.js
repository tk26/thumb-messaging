module.exports = class EmailTemplate{
  static validateMessage(messageParameters){
    if(!messageParameters){
      throw Error('The message is missing message parameters.');
    }
    if (!('toEmailAddress' in messageParameters))
    {
      throw Error('toEmailAddress is a required message param when sending an email.');
    }
  }
}
