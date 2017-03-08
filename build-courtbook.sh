#!/bin/bash
pushd ../courtbot-engine-data-courtbook
rm *.tgz
npm run build
npm pack
FILENAME=$(ls *.tgz)
popd
npm install ../courtbot-engine-data-courtbook/$FILENAME
