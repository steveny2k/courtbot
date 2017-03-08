var {defineSupportCode} = require('cucumber');
var request = require('request');
var Chance = require('chance');
var cProc = require("child_process");
var chai = require("chai");
var xml2js = require("xml2js");
var expect = chai.expect;
var {MockPhoneLookup} = require("../helpers/fakeService");

var chance = Chance();

defineSupportCode(function({Given, Then, When}) {
  When('A new case is registered via courtbook', {timeout: 60 * 1000}, function (callback) {
    // Write code here that turns the phrase above into concrete actions
    this.user = chance.word();
    this.caseNumber = chance.guid();
    this.party = chance.word();
    this.attemptedContact = chance.phone();
    this.verifiedContact = chance.phone();
    var world = this;

    MockPhoneLookup(this.attemptedContact, () => this.verifiedContact);

    request.post("http://localhost:5000/courtbook/register", {
      form:{
        api_token: "TOKEN1",
        contact: this.attemptedContact,
        communication_type: "sms",
        name: this.party,
        case_number: this.caseNumber,
        user: this.user
      }
    }, function(error, response, body) {
      expect(error).to.be.null;
      expect(response.statusCode).to.equal(200);
      var obj = JSON.parse(body);
      expect(obj.verifiedContact).to.equal(world.verifiedContact);
      world.phoneNumber = world.verifiedContact;
      setTimeout(callback, 1000);
    });
  });

  Then('Courtbot sends the contact the following message to the validated phone number:', function (string, callback) {
    if(this.verifiedContact) expect(this.twilioSms.To).to.equal(this.verifiedContact);
    expect(this.twilioSms.Body).to.equal(string
      .replace("<user>", this.user)
      .replace("<case>", this.caseNumber)
      .replace("<party>", this.party)
      .replace("<eventDate>", this.eventDate)
      .replace("<eventDescription>", this.eventDescription));
    delete this.twilioSms;
    callback();
  });
});
