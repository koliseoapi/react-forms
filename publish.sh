#!/bin/bash
# Updates the example page at icoloma.github.io
set -e

NODE_ENV=prod webpack --progress --colors --config webpack.config.js --display-error-details --display-modules 
FOLDER=.gh-pages

if [ ! -d ${FOLDER} ]; then
  git clone -b gh-pages git@github.com:icoloma/react-data-input ${FOLDER}
  cd ${FOLDER}
else
  cd ${FOLDER}
  git pull
fi

cp ../build/example.js ../lib/styles.css .
cp ../test/example.js ./example.src.js

git add .
git commit -m "${1:-Merge master}"
git push
