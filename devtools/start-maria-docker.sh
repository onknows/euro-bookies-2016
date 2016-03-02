echo "Starting a mariadb instance using docker for testing purposes"
echo "port 3307"
echo "user=root"
echo "password=bookies-password"

echo "Starting up... "

echo "RUNNING COMMANDS INSIDE THE CONTAINER"
echo " docker exec -it bookies-maria bash"
echo " export TERM=\"dumb\""
echo " mysql -u root -p"
echo " enter bookies-password"
echo " run SQL"

echo "STOPPING AND STARTING WITHOUT LOSING DATA"
echo " docker stop bookies-maria"
echo " ... wait till next day ... "
echo " docker stop bookies-maria"

echo "REMOVING THE CONTAINER AND DATA"
echo " docker rm -f bookies-maria"


docker pull mariadb:10.0.24
docker run --name bookies-maria -e MYSQL_ROOT_PASSWORD=bookies-password -d -p 3307:3306 mariadb:10.0.24

