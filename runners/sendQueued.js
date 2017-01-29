var twilio = require('twilio');
var courtbot = require('courtbot-engine');
var Localize = require('localize');
require("courtbot-engine-pg");
require("courtbot-engine-data-oscn")("tulsa", "https://oscn-case-api.herokuapp.com");
require('../config');
require("../messageSource");

courtbot.checkMissingCases({
  dbUrl: process.env.DATABASE_URL,
  twilioAccount: process.env.TWILIO_ACCOUNT_SID,
  twilioToken: process.env.TWILIO_AUTH_TOKEN,
  twilioPhone: process.env.TWILIO_PHONE_NUMBER,
  UnboundTTL: process.env.QUEUE_TTL_DAYS
});
