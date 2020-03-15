#!/bin/sh
set -e
# source config
DIRNAME=$(dirname "$0")
. "$DIRNAME/config.sh"
# apply infrastructure
cd terraform
terraform init
terraform plan \
  -var "env=$ENV" \
  -out plan
terraform apply plan
# cleanup
rm plan
cd ..
