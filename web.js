var twilio = require('twilio');
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var log4js = require("log4js");

var logfmt = require('logfmt');
var courtbot = require('courtbot-engine');
var Localize = require('localize');
var connections = require('./connectionTypes');
require("courtbot-engine-pg");
require("courtbot-engine-data-oscn")("tulsa", "https://oscn-case-api.herokuapp.com");
require("courtbot-engine-data-courtbook")("http://agile-tundra-30598.herokuapp.com/rest");
require('./config');
require("./messageSource");

var appenders = [
  {
    "type": "logLevelFilter",
    "level": "DEBUG",
    "appender": {
      "type": "console"
    }
  }
]

if(process.env.LOGENTRIES_TOKEN) {
  // log4js.loadAppender("logentries-log4js-appender");
  // log4js.addAppender(log4js.appenders["logentries-log4js-appender"]({
  //   token: process.env.LOGENTRIES_TOKEN
  // }));

  appenders.push({
    "type": "logentries-log4js-appender",
    options: {
      "token": process.env.LOGENTRIES_TOKEN
    }
  })
}
log4js.configure({appenders});

const log = log4js.getLogger("courtbot");

var localize = Localize("./strings");

var app = express();

// Express Middleware
app.use(logfmt.requestLogger());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(cookieSession({
  keys: [
    process.env.COOKIE_SECRET
  ]
}));


// Serve testing page on which you can impersonate Twilio
// (but not in production)
if (app.settings.env === 'development') {
  //app.use(express.static('public'))
}

// Allows CORS
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

// Enable CORS support for IE8.
app.get('/proxy.html', function(req, res) {
  res.send('<!DOCTYPE HTML>\n' + '<script src="http://jpillora.com/xdomain/dist/0.6/xdomain.min.js" master="http://www.courtrecords.alaska.gov"></script>');
});

app.get('/', function(req, res) {
  log.info("Homepage request", req);
  res.status(200).send('Hello, I am Courtbot. I have a heart of justice and a knowledge of court cases.');
});

const courtbotConfig = {
  dbUrl: process.env.DATABASE_URL,
  ConsoleREPL: !!process.env.USE_CONSOLE,
  reminderDaysOut: process.env.REMINDER_DAYS_OUT,
  twilioAccount: process.env.TWILIO_ACCOUNT,
  twilioToken: process.env.TWILIO_AUTH_TOKEN,
  twilioPhone: process.env.TWILIO_PHONE_NUMBER
};

connections.setup(courtbotConfig);

log.info("Courtbot config", courtbotConfig);
app.use("/", courtbot.routes(courtbotConfig));

// Error handling Middleware
app.use(function (err, req, res, next) {
  if (!res.headersSent) {
    // during development, return the trace to the client for
    // helpfulness
    log.error("Error: " + err.message, err);
    if (app.settings.env !== 'production') {
      return res.status(500).send(err.stack)
    }

    return res.status(500).send('Sorry, internal server error')
  }
});

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  log.info("Listening on " + port);
});

module.exports = app;
