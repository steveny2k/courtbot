var express = require("express");
var bodyParser = require('body-parser');
var {defineSupportCode} = require('cucumber');

var serviceApp;

defineSupportCode(function({Before, After}) {
  Before(function() {
    serviceApp = express();
    serviceApp.use(bodyParser.urlencoded({
        extended: true
    }));

    this.fakeServiceListener = serviceApp.listen(5050, function() {});
    this.fakeServiceApp = serviceApp;
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

  ExpectTwilio: function(number, sid, fn) {
    serviceApp.post(`/twilio/2010-04-01/Accounts/${sid}/Messages.json`, function(req, res) {
      fn(res.body);
    });
  }
}
