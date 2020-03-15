#!/bin/sh
set -e
CONTAINER_ID=$(docker ps -aqf 'name=postgres')
DATABASE_NAME='db'
DATABASE_USER='postgres'
for file in schema/*.sql
do
  cat $file | docker exec -i --user $DATABASE_USER $CONTAINER_ID psql $DATABASE_NAME
done
