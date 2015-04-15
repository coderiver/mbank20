#!/bin/bash
PROJECT_DIR=$(dirname $0)/../
test -d $PROJECT_DIR || exit 0
cd $PROJECT_DIR

npm install
bower update
gulp build --production
