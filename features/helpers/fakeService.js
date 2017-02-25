var express = require("express");
var {defineSupportCode} = require('cucumber');

defineSupportCode(function({Before, After}) {
  Before(function() {
    const serviceApp = express();
    this.fakeServiceListener = serviceApp.listen(5050, function() {});
    this.fakeServiceApp = serviceApp;
  });

  After(function() {
    this.fakeServiceListener.close();
  });
});
