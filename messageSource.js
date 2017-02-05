var courtbot = require('courtbot-engine');
var Localize = require('localize');
require("courtbot-engine-pg");
require('./config');

var localize = Localize("./strings");

courtbot.setMessageSource(() => ({
  remote: function(user, case_number, name) {
    return localize.translate(localize.strings.remote, user, case_number, name);
  },
  reminder: function(reg, evt) {
    return localize.translate(localize.strings.reminder, evt.date, evt.description, process.env.COURT_PUBLIC_URL, process.env.COURTBOT_TITLE);
  },
  askReminder: function(phone, registration, party) {
    return localize.translate(localize.strings.confirmRegistrationMessage, party.name);
  },
  noCaseMessage: function(caseNumber) {
    return localize.translate(localize.strings.noCase, caseNumber);
  },
  askPartyAgain: function(text, phone, registration, parties){
    var message = localize.translate(localize.strings.partyQuestionErrorMessage, text) + "\n";
    var n = 1;
    for(var i in parties) {
      var num = n++;
      message += localize.translate(localize.strings.partyQuestionPartyLineMessage, num, parties[i].name);
    }
    return message;
  },
  askParty: function(phone, registration, parties) {
    var message = localize.translate(localize.strings.partyQuestionMessage) + "\n";
    var n = 1;
    for(var i in parties) {
      var num = n++;
      message += localize.translate(localize.strings.partyQuestionPartyLineMessage, num, parties[i].name);
    }
    return message;
  },
  expiredRegistration: function() {
    return localize.translate(localize.strings.unableToFindCitationForTooLong);
  },
  confirmRegistration: function(phone, pending) {
    return localize.translate(localize.strings.registrationSuccessful);
  },
  cancelRegistration: function(phone, pending) {
    return localize.translate(localize.strings.unsubscirbed);
  },
  isOrdinal: function(text) {
    return parseInt(text) > 0;
  },
  getOrdinal: function(text) {
    return parseInt(text);
  },
  isYes: function(text) {
    return text == "YES";
  },
  isNo: function(text) {
    return text == "NO";
  }
}));
