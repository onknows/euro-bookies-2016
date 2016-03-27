#!/usr/bin/env bash
# Downloads external Ansible roles and installs SSH keys all the servers found in the hosts file

red=`tput setaf 1`
reset=`tput sgr0`

if [ -z "$1" ] ; then
    echo "${red}"
    echo "setup.sh needs 1 arugment: an inventory file"
    echo "${reset}Example: "
    echo "./setup.sh staging"
else
    echo "downloading Ansible roles ..."
    download-requirements.sh

    echo "installing generated key into all servers ...\n enter password for remote machine"
    ansible-playbook -i $1 install-ssh-key.yml --ask-pass
fi
