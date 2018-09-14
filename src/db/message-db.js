const neo4j = require('../drivers/neo4jDriver.js');
const endOfLine = require('os').EOL;

/**
 * @param {Message} message
 * @returns {Promise}
*/
exports.saveMessage = async function(message){
  let query = 'WITH datetime($createdDate) AS createDate' + endOfLine;
  query += 'MATCH(u:User{userId:{userId}})' + endOfLine;
  query += 'MERGE(m:Message{messageId:{messageId}, messageType:{messageType}, createdDate:createDate})-[:FOR]->(u)' + endOfLine;
  query += 'RETURN m';

  try {
    //create message
    await neo4j.execute(query,
      {
        messageId: message.messageId,
        userId: message.toUserId,
        messageType: message.messageType,
        createdDate: message.createdDate.toISOString()
      }
    );

    for(let i in message.deliveryMethods){
      const deliveryMethod = message.deliveryMethods[i];
      switch(deliveryMethod.type){
        case 'Email':
          await saveEmailDeliveryMethod(message.messageId, deliveryMethod);
          break;
        case 'PushNotification':
          await savePushNotificationDeliveryMethod(message.messageId, deliveryMethod);
          break;
        default:
          return;
      }
    }
  } catch(error){
    throw error;
  }
}

exports.deleteMessage = async function(messageId){
  let query = 'MATCH (m:Message{messageId:{messageId}})' + endOfLine;
  query += 'DETACH DELETE m';
  try {
    return await neo4j.execute(query,{messageId: messageId});
  } catch (err){
    throw err;
  }
}

const saveEmailDeliveryMethod = async function(messageId, email){
  let query = 'WITH datetime($scheduledDeliveryTime) AS deliveryTime' + endOfLine;
  query += 'MATCH(m:Message{messageId:{messageId}})' + endOfLine;
  query += 'MERGE (m)-[:DELIVERY_METHOD]->(e:Email{emailId: {emailId}, scheduledDeliveryTime: deliveryTime, from: {from}, to: {to}, subject: {subject}, body: {body}})';

  await neo4j.execute(query,
    {
      messageId: messageId,
      emailId: email.deliveryMethodId,
      scheduledDeliveryTime: email.scheduledDeliveryTime.toISOString(),
      from: email.from,
      to: email.to,
      subject: email.subject,
      body: email.body
    }
  );
}

const savePushNotificationDeliveryMethod = async function(messageId, pushNotification){
  let query = 'WITH datetime($scheduledDeliveryTime) AS deliveryTime' + endOfLine;
  query += 'MATCH(m:Message{messageId:{messageId}})' + endOfLine;
  query += 'MERGE (m)-[:DELIVERY_METHOD]->(pn:PushNotification{pushNotificationId: {pushNotificationId}, scheduledDeliveryTime: deliveryTime, ';
  query += 'pushToken: {pushToken}, sound: {sound}, body: {body}, data: {data}})';

  await neo4j.execute(query,
    {
      messageId: messageId,
      pushNotificationId: pushNotification.deliveryMethodId,
      scheduledDeliveryTime: pushNotification.scheduledDeliveryTime.toISOString(),
      pushToken: pushNotification.pushToken,
      sound: pushNotification.sound,
      body: pushNotification.body,
      data: pushNotification.data
    }
  );
}

exports.getEmailsToSend = async function(){
  let query = "WITH datetime() AS now" + endOfLine;
  query += "MATCH(e:Email) WHERE e.deliveredOn IS NULL AND e.scheduledDeliveryTime <= now" + endOfLine;
  query += "RETURN e.emailId, e.from, e.to, e.subject, e.body ORDER BY e.scheduledDeliveryTime LIMIT 1000";

  try {
    //get messages
    let results = await neo4j.execute(query, {
      currentTime: new Date().toISOString()
    });
    return neo4j.mapKeysToFields(results);
  } catch(error){
    throw error;
  }
}

exports.getPushNotificationsToSend = async function(){
  let query = "WITH datetime() AS now" + endOfLine;
  query += "MATCH(pn:PushNotification) WHERE pn.deliveredOn IS NULL AND pn.scheduledDeliveryTime <= now" + endOfLine;
  query += "RETURN pn.pushNotificationId, pn.pushToken, pn.sound, pn.body, pn.data ORDER BY pn.scheduledDeliveryTime LIMIT 1000";

  try {
    //get messages
    let results = await neo4j.execute(query, {
      currentTime: new Date().toISOString()
    });
    return neo4j.mapKeysToFields(results);
  } catch(error){
    throw error;
  }
}

exports.setEmailSent = async function(emailId){
  let query = "MATCH(e:Email{emailId: {emailId}})" + endOfLine;
  query += "SET e.deliveredOn = {deliveredOn}";

  try {
    //get messages
    return await neo4j.execute(query,{
      emailId: emailId,
      deliveredOn: new Date().toISOString()
    });
  } catch(error){
    throw error;
  }
}

exports.setPushNotificationSent = async function(pushNotificationId){
  let query = "WITH datetime() AS now" + endOfLine;
  query += "MATCH(pn:PushNotification{pushNotificationId: {pushNotificationId}})" + endOfLine;
  query += "SET pn.deliveredOn = now";

  try {
    //get messages
    return await neo4j.execute(query,{
      pushNotificationId: pushNotificationId
    });
  } catch(error){
    throw error;
  }
}
