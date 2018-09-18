const {NEW_FOLLOWER} = require('../../domain/MessageTypes');
const NewFollower = require('./NewFollower');

let templates = {};

templates[NEW_FOLLOWER] = NewFollower;

module.exports = templates;
