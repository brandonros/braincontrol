#!/bin/sh
CONTAINER_ID=$(docker ps -aqf 'name=postgres')
DATABASE_NAME='db'
DATABASE_USER='postgres'
docker exec -i -t --user $DATABASE_USER $CONTAINER_ID psql $DATABASE_NAME
