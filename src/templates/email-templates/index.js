const {WELCOME_EMAIL} = require('../../domain/MessageTypes');
const WelcomeEmail = require('./WelcomeEmail');

let templates = {};

templates[WELCOME_EMAIL] = WelcomeEmail;

module.exports = templates;
