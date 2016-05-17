#!groovy

pipeline('') {
    checkout scm

    stage 'compile & test'

    dir('bookies-2016-app') {
        sh 'npm install'
        sh 'npm test'
    }

    stage 'Build docker image'

    dir('bookies-2016-app') {
        sh 'docker build --build-arg software_version=$(git rev-parse --short HEAD) --build-arg image_build_timestamp=$(date -u +%Y-%m-%dT%H:%M:%S%Z) -t softwarecraftsmanshipcgi/bookies-2016-app:$(git rev-parse --short HEAD) .'
        // it would be nice tag the image with latest as well for ease of use!
    }

    stage 'acceptance test'

    // start a clean database using the mariadb docker image (The database is configured by providing environment variables using -e)
    // we use the name so we can reference to stop it later
    sh 'docker run -d --name=cucumber_bookies_db -p 7777:3306 -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=bookies_db -e MYSQL_USER=cucumber -e MYSQL_PASSWORD=cucumber mariadb'
    try {
        // update the database to the latest version using flyway. The database might not be up yet on slow nodes, so try 3 times
        retry(3) {
            sleep 20
            dir('bookies-2016-app-database') {
                // update the database to the latest known version using flyway, the version scripts are located in subdirectory sql
                sh 'flyway -user=cucumber -password=cucumber -url=\"jdbc:mysql://localhost:7777\" -schemas=bookies_db -locations=filesystem:sql migrate'
            }
        }

        // start the application and connect it to our test database, we cannot use localhost as the IP, that would not be able to go outside the container
        // to get the ip address we use $(ip route get 8.8.8.8 | head -1 | cut -d' ' -f8)
        sh 'docker run -d --name=cucumber_bookies_app -p 7778:8080 -e DB_CONNECTION_STRING=mysql://cucumber:cucumber@$(ip route get 8.8.8.8 | head -1 | cut -d\' \' -f8):7777/bookies_db softwarecraftsmanshipcgi/bookies-2016-app:$(git rev-parse --short HEAD)'
        try {
            dir('bookies-2016-app-acceptance-test') {
                // run a maven build that automatically executes cucumber acceptance tests
                sh 'mvn clean install -Dapplication.url=http://localhost:7778'
                // if the build was successful, send a slack notification, otherwise an exception is thrown and catched by the wrapper below
                notifySuccess("Bookies acceptance test succeeded");
                sh 'curl -X POST --data-urlencode \'payload={"channel": "#builds", "username": "Jenkins-Pipeline", "text": "Bookies acceptance test succeeded", "icon_emoji": ":white_check_mark:"}\' https://hooks.slack.com/services/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'
            }
        } finally {
            sh 'docker rm -f cucumber_bookies_app'             // remove the application container, to avoid building up a lot of waste
        }
    } finally {
        sh 'docker rm -f cucumber_bookies_db'                  // clean up test database container
    }

    stage 'upload to docker hub'

    sh 'docker login --username=softwarecraftsmanshipcgi --password Welkom01!' // don't store this password here!
    sh 'docker push softwarecraftsmanshipcgi/bookies-2016-app:$(git rev-parse --short HEAD)'

    stage 'deploy staging'

    dir('bookies-2016-app-deployment') {
        sh 'ansible-playbook -i /home/ubuntu/euro-bookies-2016/ansible/staging -e "@bookies-deployment-variables.yml" -e "image_version=$(git rev-parse --short HEAD)" -e ansible_ssh_private_key_file=~/.ssh/workshop_ansiblecc_key deploy-application.yml'
    }

    stage 'load test against staging'

    dir('bookies-2016-app-load-test') {
        // run the gatling tests using maven
        sh 'mvn clean install'
    }

    stage 'deploy production'

    dir('bookies-2016-app-deployment') {
        sh 'ansible-playbook -i /home/ubuntu/euro-bookies-2016/ansible/production -e "@bookies-deployment-variables.yml" -e "image_version=$(git rev-parse --short HEAD)" -e ansible_ssh_private_key_file=~/.ssh/workshop_ansiblecc_key deploy-application.yml'
    }
}

/**
 * Wrapper around the body of a node, so that we can detect pipeline failures and take some actions.
 * to unwrap: remove this method replace 'pipeline' with 'node'
 *
 * Idea is taken from: http://stackoverflow.com/questions/36837683/how-to-perform-actions-for-failed-builds-in-jenkinsfile
 */
def pipeline(String label, Closure body) {
    node(label) {
        wrap([$class: 'TimestamperBuildWrapper']) {
            try {
                body.call()
            } catch (Exception e) {
                // normally we would include the stacktrace or the exception message, but this is blocked by script-security (must be whitelisted)!
                notifyFailure("Failure in bookies pipeline, review logging for details");
                throw e; // rethrow so the build is considered failed
            }
        }
    }
}

def sendSlack(String message, String emoji) {
    sh 'curl -X POST --data-urlencode \'payload={"channel": "#builds", "username": "Jenkins-Pipeline", "text": "' + message + '", "icon_emoji": "' + emoji + '"}\' https://hooks.slack.com/services/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'
}

def notifyFailure(String message) { sendSlack(message, ":x:"); }

def notifySuccess(String message) { sendSlack(message, ":white_check_mark:"); }
