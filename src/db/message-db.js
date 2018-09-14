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
  query += 'WITH (m) OPTIONAL MATCH (m)-[:DELIVERY_METHOD]->(n) DETACH DELETE m, n' + endOfLine;
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
  query += 'pushToken: {pushToken}, sound: {sound}, title: {title}, body: {body}, data: {data}})';

  await neo4j.execute(query,
    {
      messageId: messageId,
      pushNotificationId: pushNotification.deliveryMethodId,
      scheduledDeliveryTime: pushNotification.scheduledDeliveryTime.toISOString(),
      pushToken: pushNotification.pushToken,
      sound: pushNotification.sound,
      title: pushNotification.title === undefined ? '' : pushNotification.title,
      body: pushNotification.body,
      data: JSON.stringify(pushNotification.data)
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
  query += "RETURN pn.pushNotificationId, pn.pushToken, pn.sound, pn.title, pn.body, pn.data ORDER BY pn.scheduledDeliveryTime LIMIT 1000";

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

exports.saveEmailSendResult = async function(result){
  let query = "WITH datetime() AS now" + endOfLine;
  query += "MATCH(e:Email{emailId: {emailId}})" + endOfLine;
  query += "SET e.deliveredOn = now, e.sendStatus = {sendStatus}, e.error = {error}";

  try {
    return await neo4j.execute(query,{
      emailId: result.message.emailId,
      sendStatus: result.response.status,
      error: result.response.error
    });
  } catch(error){
    throw error;
  }
}

exports.savePushNotificationSendResult = async function(result){
  let query = "WITH datetime() AS now" + endOfLine;
  query += "MATCH(pn:PushNotification{pushNotificationId: {pushNotificationId}})" + endOfLine;
  query += "SET pn.deliveredOn = now, pn.sendStatus = {sendStatus}, pn.error = {error}, pn.errorType = {errorType}";

  try {
    //get messages
    return await neo4j.execute(query,{
      pushNotificationId: result.message.pushNotificationId,
      sendStatus: result.response.status,
      error: result.response.error,
      errorType: result.response.errorType
    });
  } catch(error){
    throw error;
  }
}
