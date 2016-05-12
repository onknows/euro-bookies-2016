#!groovy
node {
    checkout scm
    dir('bookies-2016-app') {
        stage 'compile & test'
        sh 'npm install'
        sh 'npm test'


        stage 'Build docker image'
        sh 'docker build --build-arg software_version=$(git rev-parse --short HEAD) --build-arg image_build_timestamp=$(date -u +%Y-%m-%dT%H:%M:%S%Z) -t toefel/bookies-2016-app:$(git rev-parse --short HEAD) .'
        // tag the image with latest as well?
    }

    stage 'acceptance test'
    // start a clean database using the mariadb docker image (The database is configured by providing environment variables using -e,)
    // we use the name as an easy reference to stop it later
    sh 'docker run -p 7777:3306 -d -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=bookies_db -e MYSQL_USER=cucumber -e MYSQL_PASSWORD=cucumber --name=cucumber_bookies_db mariadb'
    try {
        // wait till the database is initialized booted (this should be replaced by a polling loop to reduce wait time)
        sleep 20

        dir('bookies-2016-database') {
            // update the database to the latest known version using flyway, the version scripts are located in subdirectory sql
            sh 'flyway -user=cucumber -password=cucumber -url=jdbc:mysql://localhost:7777/bookies_db -locations=filesystem:sql migrate'
        }

        // start the application and connect it to our test database
        sh 'docker run -d -p 7778:8080 --name=cucumber_bookies_app toefel/bookies-2016-app:$(git rev-parse --short HEAD)'
        try {
            dir('bookies-2016-app-acceptance-test') {
                sh 'mvn clean install'
            }
        } finally {
            sh 'docker rm -f cucumber_bookies_app'
        }
    } finally {
        // clean up test database container
        sh 'docker rm -f cucumber_bookies_db'
    }
}