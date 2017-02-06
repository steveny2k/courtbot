#Courtbot (Tulsa Edition) [![Build Status](https://travis-ci.org/codefortulsa/courtbot.svg?branch=master)](https://travis-ci.org/codefortulsa/courtbot)

## NOTES

This branch is for development of the Tulsa version. It's a WIP.


## Courtbot
Courtbot is a simple web service for handling court case data. It offers a basic HTTP endpoint for integration with websites, and a set of advanced twilio workflows to handle text-based lookup.

Specifically, the twilio features include:

- **Reminders.** If a case requires a court appearance, the app allows users to sign up for reminders, served 24 hours in advance of the case.
- **Queued Cases.** If a case isn't in the system (usually because it takes two weeks for paper citations to be put into the computer), the app allows users to get information when it becomes available. The app continues checking each day for up to 16 days and sends the case information when found (or an apology if not).

## Running Locally

First, install [node](https://github.com/codeforamerica/howto/blob/master/Node.js.md), [postgres](https://github.com/codeforamerica/howto/blob/master/PostgreSQL.md).

Since the app uses twilio to send text messages, it requires a bit of configuration. Get a [twilio account](http://www.twilio.com/), create a .env file by running `cp .env.sample .env`, and add your twilio authentication information. While you're there, add a cookie secret and an encryption key (long random strings).

Install node dependencies

```console
npm install
```

To start the web service:

```console
npm start
```

## Deploying to Heroku

First, get a twilio account and auth token as described above. Then:

```console
heroku create <app name>
heroku addons:add heroku-postgresql
heroku addons:add scheduler
heroku config:set COOKIE_SECRET=<random string>
heroku config:set TWILIO_ACCOUNT=<twilio account>
heroku config:set TWILIO_AUTH_TOKEN=<twilio auth token>
heroku config:set TWILIO_PHONE_NUMBER=<twilio phone number>
heroku config:set COURT_PUBLIC_URL=<where to send people for more info>
heroku config:set QUEUE_TTL_DAYS=<# days to keep a citation on the search queue>
heroku config:set COURTBOT_TITLE=<name for courtbot>
heroku config:set REMINDER_DAYS_OUT=<number of days out to remind users (typically 1)>
heroku config:set API_TOKENS=["key1", "key2"]
git push heroku master
heroku open
```

Finally, you'll want to setup scheduler to run the various tasks each day. Here's the recommended config:

* node runners/sendQueued.js (daily)
* node runners/sendReminders.js (daily)

## Running Unit Tests

The run the tests:

npm test
