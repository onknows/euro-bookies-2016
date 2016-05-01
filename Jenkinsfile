#!groovy
node {
    dir ('bookies-2016-app') {
        stage 'compile & test bookies-2016-app'
        sh 'npm test'

        stage 'Build docker image'
        echo 'issue docker build command'
    }
}