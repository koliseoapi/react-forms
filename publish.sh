#!/bin/bash
# Updates the example page at koliseoapi.github.io
set -e

npx webpack --progress --config webpack.config.js --mode production
FOLDER=.gh-pages

if [ ! -d ${FOLDER} ]; then
  git clone -b gh-pages git@github.com:koliseoapi/react-forms ${FOLDER}
  cd ${FOLDER}
else
  cd ${FOLDER}
  git pull
fi

cp ../build/example.js .
cp ../test-page/example.tsx ./example.src.js

git add .
git commit -m "${1:-Merge master}"
git push
