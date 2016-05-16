# Euro Bookies 2016
Small REST application which people can use to bet on EK teams, purpose is to demonstrate ci/cd

[![travis-ci](https://travis-ci.org/toefel18/euro-bookies-2016.svg?branch=master "build")](https://travis-ci.org/toefel18/euro-bookies-2016) [![Stories in Ready](https://badge.waffle.io/toefel18/euro-bookies-2016.svg?label=ready&title=Issues%20Ready)](http://waffle.io/toefel18/euro-bookies-2016) [![In Progress](https://badge.waffle.io/toefel18/euro-bookies-2016.svg?label=In%20Progress&title=Issues%20In%20Progress)](http://waffle.io/toefel18/euro-bookies-2016) view task board on [waffle.io](http://waffle.io/toefel18/euro-bookies-2016)
 
# Branches

   * master   -> containing the application
   * ansible  -> containing ansible materials for provisioning the platform. consisting of: 
       * buildserver 
       * acceptance environment with
           * docker server
           * database server
       * production environment with
           * docker server
           * database server

# Repository layout

  * bookies-2016-app contains the nodejs application
  * bookies-2016-app-database contains the database versions, see start-mysql-docker.sh for instructions
  * bookies-2016-app-acceptance-test contains the acceptance tests, written in business language using Cucumber
  * bookies-2016-app-load-test contains a load test based on a user scenario using Gatling
  * bookies-2016-app-deployment contains ansible scripts to deploy the application, requires resources from the *ansible* branch


