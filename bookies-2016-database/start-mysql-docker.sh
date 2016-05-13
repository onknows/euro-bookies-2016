#!/usr/bin/env bash
echo "Starting a mariadb instance using docker for testing purposes"
docker run --name bookies-maria -d -p 3306:3306 -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=bookies_db -e MYSQL_USER=bookies -e MYSQL_PASSWORD=bookies mariadb:10.0.24
echo "waiting for container to be ready..."
sleep 15
echo "Use flyway to bring the database schema to the latest version (flyway must be on PATH)"
flyway -user=root -password=root -url=jdbc:mysql://localhost:3306/bookies_db -locations=filesystem:sql migrate


echo "RUNNING COMMANDS INSIDE THE CONTAINER"
echo "  docker exec -it bookies-maria /bin/bash"
echo "  export TERM=\"dumb\""
echo "  mysql -u root -p"
echo "  enter root"
echo "  run SQL"
echo ""
echo "REMOVING THE CONTAINER AND DATA"
echo " docker rm -f bookies-maria"
echo ""
LOCAL_IP=$(ip route get 8.8.8.8 | head -1 | cut -d' ' -f8)
echo "DONE, connect using url: mysql://root:root@${LOCAL_IP}:3306/bookies_db"