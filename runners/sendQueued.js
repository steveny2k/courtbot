var twilio = require('twilio');
var courtbot = require('courtbot-engine');
var Localize = require('localize');
var connections = require('../connectionTypes');
require("courtbot-engine-pg");
require("courtbot-engine-data-oscn")("tulsa", "https://oscn-case-api.herokuapp.com");
require('../config');
require("../messageSource");
var options = {
  dbUrl: process.env.DATABASE_URL,
  twilioAccount: process.env.TWILIO_ACCOUNT,
  twilioToken: process.env.TWILIO_AUTH_TOKEN,
  twilioPhone: process.env.TWILIO_PHONE_NUMBER
}
connections.setup(options)
courtbot.checkMissingCases(options);
