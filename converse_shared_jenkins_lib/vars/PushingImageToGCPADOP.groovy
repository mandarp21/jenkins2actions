def call(String serviceName){
    ansiColor('xterm') {
        unstash 'build-artefacts'
        unstash 'commit.properties'
        // wrap([$class: 'AmazonAwsCliBuildWrapper', credentialsId: 'service_user', defaultRegion: 'us-east-1'])
        script {
            COMMIT_ID = readFile('commit.properties').trim()
                docker.withRegistry('https://us.gcr.io', 'gcr:dol-virtualassistant-dev') {
                docker.build("us.gcr.io/dol-virtualassistant-dev/jenkins/${serviceName}", "--no-cache .")
                docker.image("us.gcr.io/dol-virtualassistant-dev/jenkins/${serviceName}").push("${BUILD_NUMBER}-$COMMIT_ID")
            }
        }
    }
}
