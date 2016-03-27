#!/usr/bin/env bash
# Run this script once after a checkout to set-up the environment

echo "downloading Ansible roles ..."
download-requirements.sh

echo "creating .ssh directory ..."
mkdir ~/.ssh/

echo "creating a key-pair that ansible will use..."
ssh-keygen -t rsa -N "" -f ~/.ssh/id_rsa

echo "disabling host checking for this session ..., for new sessions use:"
echo "export ANSIBLE_HOST_KEY_CHECKING=False"
export ANSIBLE_HOST_KEY_CHECKING=False

echo "installing generated key into all servers ...\n enter password for remote machine"
ansible-playbook -i $1 install-ssh-key.yml --ask-pass