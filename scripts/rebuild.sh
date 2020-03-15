#!/bin/sh
set -e
# check arguments
CONTAINER_NAME=$1
if [ -z "$CONTAINER_NAME" ]
then
  echo "usage: rebuild CONTAINER_NAME"
  exit 1
fi
# source config
DIRNAME=$(dirname "$0")
. "$DIRNAME/config.sh"
# cleanup + build container
cd $CONTAINER_NAME
PACKAGE_NAME=$(jq -r '.name' package.json)
PACKAGE_VERSION=$(jq -r '.version' package.json)
docker image rm -f $PACKAGE_NAME:$PACKAGE_VERSION
docker build . -t $PACKAGE_NAME:$PACKAGE_VERSION
cd ..
# taint infrastructure
cd terraform
terraform taint -allow-missing docker_container.$CONTAINER_NAME[0]
terraform taint -allow-missing docker_container.$CONTAINER_NAME[1]
cd ..
