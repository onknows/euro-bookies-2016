#!/usr/bin/env bash
echo "Starting a mariadb instance using docker for testing purposes"
echo "port 3306"
echo "user=root"
echo "password=root"

echo "Starting up... "

echo "RUNNING COMMANDS INSIDE THE CONTAINER"
echo " docker exec -it bookies-maria bash"
echo " export TERM=\"dumb\""
echo " mysql -u root -p"
echo " enter root"
echo " run SQL"

echo "STOPPING AND STARTING WITHOUT LOSING DATA"
echo " docker stop bookies-maria"
echo " ... wait till next day ... "
echo " docker stop bookies-maria"

echo "REMOVING THE CONTAINER AND DATA"
echo " docker rm -f bookies-maria"

docker pull mariadb:10.0.24

echo "Running mariadb using docker"
docker run --name bookies-maria -d -e MYSQL_ROOT_PASSWORD=root -p 3306:3306 mariadb:10.0.24
echo "waiting ..."
sleep 20

echo "Create the bookies_db, the schema is provided by the platform as well! (ansible provisions a schema)"
mysql -u root --password=root --protocol TCP -e 'CREATE DATABASE bookies_db;'

echo "Use flyway to bring the database schema to the latest version" 
/opt/flyway-4.0/flyway -user=root -password=root -url=jdbc:mysql://localhost:3306/bookies_db -locations=filesystem:sql migrate
