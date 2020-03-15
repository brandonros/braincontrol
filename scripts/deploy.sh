#!/bin/sh
set -e
sh scripts/rebuild.sh api
sh scripts/rebuild.sh ui
cd terraform
terraform taint -allow-missing docker_container.nginx
cd ..
sh scripts/apply.sh
sh scripts/migrate-database.sh
