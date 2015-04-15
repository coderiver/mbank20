#!/bin/bash
PROJECT_DIR=$(dirname $0)/../
test -d $PROJECT_DIR || exit 0
cd $PROJECT_DIR

echo "Updation system"
apt-get update
apt-get install git-core curl build-essential openssl libssl-dev
echo "Installing Compass"
apt-get install ruby-full rubygems1.9
gem install sass --no-document
gem install compass --pre --no-document
ruby -v
echo "Installing NPM"
apt-get install nodejs-legacy
apt-get install npm
echo "Installing Bower"
npm install -g bower
echo "Installing Gulp"
npm install -g gulp

