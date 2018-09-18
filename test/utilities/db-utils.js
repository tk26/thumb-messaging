const neo4j = require('../../src/drivers/neo4jDriver.js');

exports.addUser = async(fakeUserId) => {
  let query = 'CREATE (u:User{userId: {userId}})';
  try {
    return await neo4j.execute(query,{userId: fakeUserId});
  } catch (err){
    throw err;
  }
}

exports.deleteUser = async(fakeUserId) => {
  let query = 'MATCH(u:User{userId: {userId}}) DETACH DELETE u';
  try {
    return await neo4j.execute(query,{userId: fakeUserId});
  } catch (err){
    throw err;
  }
}
