#!groovy

pipeline('') {
    checkout scm
    dir('bookies-2016-app') {
        stage 'compile & test'
        sh 'npm install'
        sh 'npm test'


        stage 'Build docker image'
        sh 'docker build --build-arg software_version=$(git rev-parse --short HEAD) --build-arg image_build_timestamp=$(date -u +%Y-%m-%dT%H:%M:%S%Z) -t softwarecraftsmanshipcgi/bookies-2016-app:$(git rev-parse --short HEAD) .'
        // tag the image with latest as well?
    }

    stage 'acceptance test'
    // start a clean database using the mariadb docker image (The database is configured by providing environment variables using -e,)
    // we use the name as an easy reference to stop it later
    sh 'docker run -d --name=cucumber_bookies_db -p 7777:3306 -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=bookies_db -e MYSQL_USER=cucumber -e MYSQL_PASSWORD=cucumber mariadb'
    try {
        // wait till the database is initialized booted (this should be replaced by a polling loop to reduce wait time)
        sleep 20

        dir('bookies-2016-database') {
            // update the database to the latest known version using flyway, the version scripts are located in subdirectory sql
            sh 'flyway -user=cucumber -password=cucumber -url=jdbc:mysql://localhost:7777/bookies_db -locations=filesystem:sql migrate'
        }

        // start the application and connect it to our test database
        // we cannot use localhost as the IP, that would not be able to go outside the container
        // to get the ip address we use $(ip route get 8.8.8.8 | head -1 | cut -d' ' -f8)
        sh 'docker run -d --name=cucumber_bookies_app -p 7778:8080 -e DB_CONNECTION_STRING=mysql://cucumber:cucumber@$(ip route get 8.8.8.8 | head -1 | cut -d\' \' -f8):7777/bookies_db softwarecraftsmanshipcgi/bookies-2016-app:$(git rev-parse --short HEAD)'
        try {
            dir('bookies-2016-app-acceptance-test') {
                // run a maven build that automatically executes cucumber acceptance tests
                sh 'mvn clean install -Dapplication.url=http://localhost:7778'
                // if the build was successful, send a slack notification, otherwise an exception is thrown and catched by the wrapper below
                sh 'curl -X POST --data-urlencode \'payload={"channel": "#builds", "username": "Jenkins-Pipeline", "text": "Bookies acceptance test succeeded", "icon_emoji": ":white_check_mark:"}\' https://hooks.slack.com/services/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'
            }
        } finally {
            // remove the application container, to avoid building up a lot of waste
            sh 'docker rm -f cucumber_bookies_app'
        }
    } finally {
        // clean up test database container
        sh 'docker rm -f cucumber_bookies_db'
    }

    stage 'Uploading verified image to docker hub'
    sh 'docker login --username=softwarecraftsmanshipcgi --password Welkom01!'
    sh 'docker push softwarecraftsmanshipcgi/bookies-2016-app:$(git rev-parse --short HEAD)'
}

/** Wrapper around the body of a node, so that we can send slack notifications, to unwrap, just remove this method replace pipeline with node */
def pipeline(String label, Closure body) {
    node(label) {
        wrap([$class: 'TimestamperBuildWrapper']) {
            try {
                body.call()
            } catch (Exception e) {
                // send slack on failure: http://stackoverflow.com/questions/36837683/how-to-perform-actions-for-failed-builds-in-jenkinsfile
                sh 'curl -X POST --data-urlencode \'payload={"channel": "#builds", "username": "Jenkins-Pipeline", "text": "bookies pipeline failed! See logging for more information", "icon_emoji": ":x:"}\' https://hooks.slack.com/services/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'
                throw e; // rethrow so the build is considered failed
            }
        }
    }
}