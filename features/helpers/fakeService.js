var express = require("express");
var bodyParser = require('body-parser');
var {defineSupportCode} = require('cucumber');

var serviceApp;
var phoneVerification;
var registeredEvents;

defineSupportCode(function({Before, After}) {
  Before(function() {
    serviceApp = express();

    // var logger = function(req, res, next) {
    //     console.log("GOT REQUEST !", req.url);
    //     next(); // Passing the request to the next handler in the stack.
    // }
    //
    // serviceApp.use(logger);
    serviceApp.use(bodyParser.urlencoded({
        extended: true
    }));

    this.fakeServiceListener = serviceApp.listen(5050, function() {});
    this.fakeServiceApp = serviceApp;

    var world = this;

    serviceApp.post(`/twilio/Accounts/TWILIOSID/Messages.json`, function(req, res) {
      world.twilioSms = req.body;
      res.end("");
    });

    this.phoneVerification = phoneVerification = {};

    serviceApp.get("/twilioLookups/PhoneNumbers/:phone", function(req, res) {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({phone_number: world.phoneVerification[req.params.phone](req.params.phone)}));
    });

    registeredEvents = {};

    serviceApp.get(`/oscn/case/tulsa/:caseNumber/:partyName`, function(req, res) {
      console.log(`Getting case for ${req.params.partyName} and number ${req.params.caseNumber}`);
      res.setHeader('Content-Type', 'application/json');
      if(!registeredEvents[req.params.caseNumber] || !registeredEvents[req.params.caseNumber][req.params.partyName]) {
          res.end(JSON.stringify([{events: []}]));
          return;
      }
      res.end(JSON.stringify([{events: registeredEvents[req.params.caseNumber][req.params.partyName]}]));
    });
  });

  After(function() {
    this.fakeServiceListener.close();
  });
});

module.exports = exports = {
  MockCase: function(caseNumber, partyNames) {
    serviceApp.get(`/oscn/case/tulsa/${caseNumber}`, function(req, res) {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ defendants: partyNames.map(function(r) { return ({ name: r }); }) }));
    });
  },

  MockEvents: function(caseNumber, partyName, events) {
    registeredEvents[caseNumber] = registeredEvents[caseNumber] || {}
    registeredEvents[caseNumber][partyName] = events;
  },

  MockPhoneLookup: function(phoneNumber, fn, world) {
    phoneVerification[phoneNumber] = fn;
  }
}
