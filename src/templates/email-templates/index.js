const {WELCOME_EMAIL,
  ACCOUNT_VERIFICATION,
  PASSWORD_RESET,
  PASSWORD_RESET_CONFIRMATION} = require('../../domain/MessageTypes');
const WelcomeEmail = require('./WelcomeEmail');
const VerifcationEmail = require('./VerificationEmail');
const PasswordResetEmail = require('./PasswordResetEmail');
const PasswordResetConfirmationEmail = require('./PasswordResetConfirmationEmail');

let templates = {};

templates[WELCOME_EMAIL] = WelcomeEmail;
templates[ACCOUNT_VERIFICATION] = VerifcationEmail;
templates[PASSWORD_RESET] = PasswordResetEmail;
templates[PASSWORD_RESET_CONFIRMATION] = PasswordResetConfirmationEmail;

module.exports = templates;
