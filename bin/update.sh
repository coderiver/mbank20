#!/bin/bash
PROJECT_DIR=$(dirname $0)/../
test -d $PROJECT_DIR || exit 0
cd $PROJECT_DIR

git pull origin
./bin/rebuild.sh
