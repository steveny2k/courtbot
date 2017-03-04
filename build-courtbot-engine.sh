#!/bin/bash
pushd ../courtbot-engine
rm *.tgz
npm run build
npm pack
FILENAME=$(ls *.tgz)
popd
npm install ../courtbot-engine/$FILENAME
