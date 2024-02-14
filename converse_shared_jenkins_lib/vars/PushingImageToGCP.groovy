def call(String serviceName){
    ansiColor('xterm') {
        unstash 'build-artefacts'
        unstash 'commit.properties'
        // wrap([$class: 'AmazonAwsCliBuildWrapper', credentialsId: 'service_user', defaultRegion: 'us-east-1'])
        script {
            COMMIT_ID = readFile('commit.properties').trim()
                docker.withRegistry('https://us.gcr.io', 'gcr:acn-newyork-dol-gcp') {
                docker.build("us.gcr.io/acn-newyork-dol-gcp/converse3/${serviceName}", "--no-cache .")
                docker.image("us.gcr.io/acn-newyork-dol-gcp/converse3/${serviceName}").push("${BUILD_NUMBER}-$COMMIT_ID")
            }
        }
    }
}
