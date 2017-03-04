#!/bin/bash
pushd ../courtbot-engine-data-oscn
rm *.tgz
npm run build
npm pack
FILENAME=$(ls *.tgz)
popd
npm install ../courtbot-engine-data-oscn/$FILENAME
