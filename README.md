# Euro Bookies 2016

Small REST application which people can use to bet on EK teams, purpose is to demonstrate ci/cd

# Welcome to the Ansible branch

This branch contains materials for provisioning the continuous delivery pipeline.

This pipeline consists of:
 * Jenkins
 * Multiple chained jobs to assert software quality
 * Acceptance environment, identical to production
 * Production environment
 * Automatic pushes to acceptance
 * Human supervised pushes to production

The acceptance and production environments consist of:
 * Database server with mariadb
 * Application server using Docker to deploy
 * Public access on port 80

### Getting started

**DONE BY WORKSHOP HOSTS**
 1. Launch amazon ec2 Ubuntu nodes and use the aws-setup/aws-ansiblecc-setup.sh in the user data field. (This script is run during boot and configures the required software packaged, ssh-access and ansible scripts necessary to get started.)
 2. Assign each group with a connection string

**DONE BY STUDENTS**
 1. Connect to the GROUPINFRA-I network (SSH access disabled on GROUPINFRA-C)
 2. Connect to the ansible control center (ansible cc) using the private key in aws-setup

  *connect using ssh*
  ```bash
    ssh -i aws-setup/workshop_ansiblecc_key ubuntu@${GROUP_ANSIBLE_IP}
  ```
  *connect using putty*
    * start putty and go to **Connection>SSH>Auth**
    * select private key for authentication
       - browse and choose *aws-setup/aws_ansiblecc_key*
    * go to **Session** and enter ubuntu@${GROUP_ANSIBLE_IP}

 3. when connected to the provisioner cd to the project directory containing workshop materials ```cd euro-bookies-2016```
 4. follow instructions from the workshop hosts
