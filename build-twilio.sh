#!/bin/bash
pushd ../courtbot-engine-twilio
rm *.tgz
npm run build
npm pack
FILENAME=$(ls *.tgz)
popd
npm install ../courtbot-engine-twilio/$FILENAME
