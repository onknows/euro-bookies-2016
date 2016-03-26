#!/usr/bin/env bash
# retrieves the IP addresses of each machine in the test cluster
# and stores them as an inventory format file which ansible can consume

DOCKERVM_IP=$(vagrant ssh dockervm -c "ip address show eth1 | grep 'inet ' | sed -e 's/^.*inet //' -e 's/\/.*$//'")
DB_IP=$(vagrant ssh mysql -c "ip address show eth1 | grep 'inet ' | sed -e 's/^.*inet //' -e 's/\/.*$//'")
BUILDSERVER_IP=$(vagrant ssh buildserver -c "ip address show eth1 | grep 'inet ' | sed -e 's/^.*inet //' -e 's/\/.*$//'")

echo "docker node       $DOCKERVM_IP"
echo "db node           $DB_IP"
echo "buildserver node  $BUILDSERVER_IP"

echo "creating  ../ansible/vm-test-cloud  which you can use as inventory"

cat << EOF > ../ansible/vm-test-cloud
[docker]
${DOCKERVM_IP::-1}  ansible_user=vagrant

[db]
${DB_IP::-1}  ansible_user=vagrant

[buildserver]
${BUILDSERVER_IP::-1}  ansible_user=vagrant

[all:children]
docker
db
buildserver
EOF