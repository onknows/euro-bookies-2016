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
 1. Create a new IAM user in Amazon AWS, and attach the security policy `AmazonEC2FullAccess` and another with `AmazonEC2ReadOnlyAccess`, download the credentials
 2. Install awscli see [prvision-workshop.yml](aws-setup/provision-workshop.yml) documentation
 3. On the command line, execute: `aws configure` and configure the credentials of the account with AmazonEC2FullAccess rights, leave region (eu-west-1) and output format (json) as is.
 4. Automatically create and start nodes in Amazon EC2 for each group using Ansible
  
    ```bash 
    cd aws-setup
    ansible-playbook provision-workshop.yml"
    ```
    
 5. We now have a bunch of servers, each with their unique tags. Now we need configure the servers of each group so that they can find each other by writing the access key and appropriate tag info in the inventories of each group's buildserver . Wait a while for cloud-init to complete (takes approx 2 minutes, for certainty check the `/var/log/cloud-init.log` on a buildserver). Then fill in the AmazonEC2ReadOnlyAccess account credentials and execute: 
 
    ```bash
    ansible-playbook -i ../ansible/production configure-inventories-for-each-group.yml -e "ansible_read_access_key=<READONLY_KEY> ansible_read_secret_key=<READONLY_SECRET>"
    ```
    
 6. Provide each group with the IP addresses of their servers
 
    ```bash
    ansible-playbook -i ../ansible/production list-all-workshop-ip-addresses.yml | grep msg | sort | tee > ip.txt
    ```

**DONE BY STUDENTS**
 
 Please view [these sheets with instructions and exercises](https://docs.google.com/presentation/d/1ZwmTWrq3mVdq0S4bg9DYqjiLdbOjx64fBzh9Ao4T0Cg/edit?usp=sharing) and skip the steps below.  
 
 
 
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
