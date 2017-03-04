var express = require("express");
var bodyParser = require('body-parser');
var {defineSupportCode} = require('cucumber');

var serviceApp;
var phoneVerification;

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
    serviceApp.get(`/oscn/case/tulsa/${caseNumber}/${partyName}`, function(req, res) {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify([{events}]));
    });
  },

  MockPhoneLookup: function(phoneNumber, fn, world) {
    phoneVerification[phoneNumber] = fn;
  }
}
