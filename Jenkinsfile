#!groovy

stage 'compile & test'

pipelineStep('') {
    checkout scm

    dir('bookies-2016-app') {
        notifySlackIfFailed("compile and test") {
            sh 'npm install'
            sh 'npm test'
        }
    }
}

stage 'Build docker image'

pipelineStep('') {
    dir('bookies-2016-app') {
        notifySlackIfFailed("building docker image") {
            sh 'docker build --build-arg software_version=$(git rev-parse --short HEAD) --build-arg image_build_timestamp=$(date -u +%Y-%m-%dT%H:%M:%S%Z) -t softwarecraftsmanshipcgi/bookies-2016-app:$(git rev-parse --short HEAD) .'
            // it would be nice tag the image with latest as well for ease of use!
        }
    }
}

stage name: 'acceptance test', concurrency: 1

pipelineStep('') {

    // start a clean database using the mariadb docker image (The database is configured by providing environment variables using -e)
    // we use the name so we can reference to stop it later
    sh 'docker run -d --name=cucumber_bookies_db -p 8777:3306 -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=bookies_db -e MYSQL_USER=cucumber -e MYSQL_PASSWORD=cucumber mariadb'
    try {
        // update the database to the latest version using flyway. The database might not be up yet on slow nodes, so try 3 times
        retry(3) {
            sleep 20
            dir('bookies-2016-app-database') {
                // update the database to the latest known version using flyway, the version scripts are located in subdirectory sql
                sh 'flyway -user=cucumber -password=cucumber -url=\"jdbc:mysql://localhost:8777\" -schemas=bookies_db -locations=filesystem:sql migrate'
            }
        }

        // start the application and connect it to our test database, we cannot use localhost as the IP, that would not be able to go outside the container
        // to get the ip address we use $(ip route get 8.8.8.8 | head -1 | cut -d' ' -f8)
        sh 'docker run -d --name=cucumber_bookies_app -p 8778:8080 -e DB_CONNECTION_STRING=mysql://cucumber:cucumber@$(ip route get 8.8.8.8 | head -1 | cut -d\' \' -f8):8777/bookies_db softwarecraftsmanshipcgi/bookies-2016-app:$(git rev-parse --short HEAD)'
        try {
            dir('bookies-2016-app-acceptance-test') {
                // run a maven build that automatically executes cucumber acceptance tests
                notifySlackIfFailed("acceptance test") {
                    sh 'mvn clean install -Dapplication.url=http://localhost:8778'
                }
            }
        } finally {
            // remove the application container, to avoid building up a lot of waste
            sh 'docker rm -f cucumber_bookies_app'
        }
    } finally {
        sh 'docker rm -f cucumber_bookies_db'                  // clean up test database container
    }
}

/**
 * Wrapper around the body of a node, so that we can detect failures and take action (like messaging).
 * to unwrap: remove this method and replace 'pipelineStep' with 'node'
 *
 * Idea is taken from: http://stackoverflow.com/questions/36837683/how-to-perform-actions-for-failed-builds-in-jenkinsfile
 */
def pipelineStep(String label, Closure body) {
    node(label) {
        wrap([$class: 'TimestamperBuildWrapper']) {
            try {
                body.call()
            } catch (Exception e) {
                // normally we would include the stacktrace or the exception message, but this is blocked by script-security (must be whitelisted)!
                notifyFailureViaSlack("Failure in bookies pipelineStep, review logging for details");
                throw e; // rethrow so the build is considered failed
            }
        }
    }
}

/** rgbColorCode should be in the form of FF0000 (which produces red)*/
def sendSlack(String message, String rgbColorCode) {
    sh 'curl -X POST --data-urlencode payload=\'{"channel": "#builds","attachments":[{"fallback": "\'"$BRANCH_NAME"\''  + message + '","color": "#' + rgbColorCode + '","fields": [{"short": false,"value": "\'"$BRANCH_NAME"\': ' + message + '"}],"mrkdwn_in": [ "pretext", "text", "fields"]}]}\' https://cgi-craftsmanship.slack.com/services/hooks/jenkins-ci?token=0YiLVF6DZUkYpXX403Iet104'
}

def notifySlackIfFailed(String taskName, Closure body) {
    try {
        body.call()
    } catch (Exception e) {
        // normally we would include the stacktrace or the exception message, but this is blocked by script-security (must be whitelisted)!
        notifyFailureViaSlack("${taskName} failed");
        throw e; // rethrow so the build is considered failed
    }
}

def notifyFailureViaSlack(String message) { sendSlack(message, "FF0000"); }

def notifySuccessViaSlack(String message) { sendSlack(message, "00FF00"); }
