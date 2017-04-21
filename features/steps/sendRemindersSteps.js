var {defineSupportCode} = require('cucumber');
var request = require('request');
var Chance = require('chance');
var cProc = require("child_process");
var chai = require("chai");
var xml2js = require("xml2js");
var expect = chai.expect;
var {MockCase, MockEvents} = require("../helpers/fakeService");
var pg = require("pg");
var chance = Chance();
var moment = require("moment-timezone");
var proc = require("child_process");

defineSupportCode(function({Given, Then, When}) {
  function CaseWithEvent(arg1, callback) {
    this.caseNumber = chance.guid();
    this.party = `${chance.last()}, ${chance.first()}`;
    this.eventDescription = chance.paragraph();
    var evt = moment().add(arg1, "hours");
    this.eventDate = evt.tz("America/Chicago").format("MMMM D, YYYY h:mm A");

    MockCase(this.caseNumber, [this.party]);
    MockEvents(this.caseNumber, this.party, [{
      date: evt.format(),
      description: this.eventDescription
    }]);

    callback();
  }
  Given('A case exists with an event {arg1:int} hour out', CaseWithEvent);
  Given('A case exists with an event {arg1:int} hours out', CaseWithEvent);

  Given('A user is registered for that case and party', function (callback) {
    var world = this;
    pg.connect(`postgres://postgres:${process.env.PGPASSWORD}@localhost:5432/courtbotat`, function(err, client, done) {
      if(err){
        done();
        console.error("Error registering:", err);
      }
      expect(!!err).to.equal(false);

      var registration = {
        contact: world.phoneNumber,
        communication_type: "sms",
        name: world.party,
        state: 3,
        case_number: world.caseNumber
      }

      client.query('INSERT INTO registrations (contact, communication_type, name, state, case_number, create_date) VALUES ($1,$2,$3,$4,$5,$6) RETURNING registration_id',
        [registration.contact || registration.phone, registration.communication_type || "sms", registration.name, registration.state, registration.case_number, moment().toString()],
        function(err, result) {
          expect(err).to.be.null;
          if(result.rows.length == 1){
            done();
            callback();
          }
          else {
            done();
            callback();
          }
        });
    });
  });
  When('I run the send reminders task', {timeout: 60 * 1000}, function (callback) {
    proc.fork("runners/sendReminders")
    .on('error', function(error) {
      console.log("ERROR: DETAILS: " + error);
    })
    .on("exit", function() {
      callback();
    });
  });
  Then('Courtbot does not send a message', function (callback) {
    expect(this.twilioSms).to.be.undefined;
    callback();
  });
});
