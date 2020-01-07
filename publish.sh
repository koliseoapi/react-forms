#!/bin/bash
# Updates the example page at koliseoapi.github.io
set -e

NODE_ENV=prod npx webpack --progress --colors --config webpack.config.js --display-error-details --display-modules 
FOLDER=.gh-pages

if [ ! -d ${FOLDER} ]; then
  git clone -b gh-pages git@github.com:koliseoapi/react-forms ${FOLDER}
  cd ${FOLDER}
else
  cd ${FOLDER}
  git pull
fi

cp ../build/example.js ../src/styles.css .
cp ../test-page/example.js ./example.src.js

git add .
git commit -m "${1:-Merge master}"
git push
