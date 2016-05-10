#!groovy
node {
    checkout scm
    dir ('bookies-2016-app') {
        stage 'compile & test bookies-2016-app'
        sh 'npm install'
        sh 'npm test'

        stage 'Build docker image'
        sh 'docker build --build-arg software_version=$(git rev-parse --short HEAD) --build-arg image_build_timestamp=$(date -u +%Y-%m-%dT%H:%M:%S%Z) -t bookies-2016-app:$(git rev-parse --short HEAD) .'
        // tag the image with latest as well?
    }
}