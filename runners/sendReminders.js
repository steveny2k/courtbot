var courtbot = require('courtbot-engine');
var connections = require('../connectionTypes')
require("courtbot-engine-pg");
require('../config');
require("courtbot-engine-data-oscn")(
  process.env.OSCN_COUNTY || "tulsa",
  process.env.OSCN_API_URL || "https://oscn-case-api.herokuapp.com"
);
require("courtbot-engine-data-courtbook")({
    courtbookUrl: process.env.COURTBOOK_URL,
    oauthConfig: {
        tokenUrl: process.env.COURTBOOK_OAUTH_TOKEN_URL,
        audience: process.env.COURTBOOK_OAUTH_AUDIENCE,
        clientId: process.env.COURTBOOK_OAUTH_CLIENT_ID,
        clientSecret: process.env.COURTBOOK_OAUTH_SECRET
    }
});
var options = {
  dbUrl: process.env.DATABASE_URL,
  twilioAccount: process.env.TWILIO_ACCOUNT,
  twilioToken: process.env.TWILIO_AUTH_TOKEN,
  twilioPhone: process.env.TWILIO_PHONE_NUMBER,
  reminderDaysOut: process.env.REMINDER_DAYS_OUT,
  timeZoneName: "America/Chicago"
}
connections.setup(options)
courtbot.sendDueReminders(options)
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
