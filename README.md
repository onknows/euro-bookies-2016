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
 1. Create a new IAM user in Amazon AWS, and attach the security policy `AmazonEC2FullAccess` or `AmazonEC2ReadOnlyAccess`, download the credentials
 2. Configure aws_access_key_id and aws_secret_access_key in ```ansible/staging/ec2.ini``` and ```ansible/production/ec2.ini```
 3. Commit! (otherwise all users won't have access)
 4. Automatically provision nodes in Amazon EC2 for each group using Ansible
  
    ```bash 
    cd aws-setup
    ansible-playbook provision-workshop.yml -e "ec2_access_key=<KEY> ec2_secret_key=<SECRET>"
    ```
    
 5. Provide each group with the IP addresses of their servers

**DONE BY STUDENTS**
 1. (within CGI) Connect to the GROUPINFRA-I network, because SSH access disabled on GROUPINFRA-C
 2. Connect to the buildserver of your group (which is also our ansible control center) using the `workshop_ansiblecc_key` in aws-setup

  *connect using ssh*
  
  ```bash
    ssh -i aws-setup/workshop_ansiblecc_key ubuntu@${GROUP_ANSIBLE_IP}
  ```
  
  *connect using putty*
    * start putty and go to **Connection>SSH>Auth**
    * select private key for authentication
       - browse and choose *aws-setup/aws_ansiblecc_key*
    * go to **Session** and enter ubuntu@${GROUP_BUILDSERVER_IP}

 3. When connected to the buildserver: cd to the project directory containing the platform scripts ```cd euro-bookies-2016/ansible```
 4. Test connectivity with staging servers ```ansible -i staging -m ping allservers```
 5. Test connectivity with production servers ```ansible -i production -m ping allservers```
 5. Follow the instructions (take a look through the YAML files while waiting, start with site.yml)
