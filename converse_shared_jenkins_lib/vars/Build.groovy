def call(){
    ansiColor('xterm') {
        unstash 'build-artefacts'
        sshagent(['adopssh']) {
            sh '''#!/bin/bash -e
            pwd
            ls
            cd server
            mkdir -p ~/.ssh
            ssh-keyscan innersource.accenture.com > ~/.ssh/known_hosts
            set -x
            npm cache clean -f
            #sudo apk add build-base
            npm install -g n
            n --arch x64-musl v14.15.3
            npm run install-all
            '''
        }
    }
    
    stash includes: '**/**', name: 'build-artefacts'
}
