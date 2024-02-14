def call(){
      checkout scm
      sshagent(['adop-jenkins']) {
        sh '''#!/bin/bash -eux
        export COMMIT_ID=$(git rev-parse HEAD | cut -c 1-8)
        echo "$COMMIT_ID" > commit.properties
        # git tag jenkins-$BUILD_NUMBER
        # git push --tags
        '''
      }
      stash includes: '**/**', name: 'build-artefacts'
      stash includes: '**/**', name: 'git-repo', useDefaultExcludes: false
      stash includes: 'commit.properties', name: 'commit.properties'
}