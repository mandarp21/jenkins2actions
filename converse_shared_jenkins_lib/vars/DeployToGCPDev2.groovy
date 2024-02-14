def call(String serviceName, String dev2ClusterNamespace ){
  ansiColor('xterm') {
    unstash 'git-repo'
    sshagent(['adopssh']) {
        withCredentials([[$class: 'FileBinding', credentialsId: 'devsrv12va', variable: 'GOOGLE_APPLICATION_CREDENTIALS']]) {
            sh '''#!/bin/bash -eux     
             
            echo "Install kubectl client"
            curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl
            chmod +x ./kubectl

            echo "Install Helm client"
            wget https://get.helm.sh/helm-v2.17.0-linux-amd64.tar.gz
            tar -xvf helm-v2.17.0-linux-amd64.tar.gz
            #sudo mv linux-amd64/helm /usr/local/bin/helm
            export PATH=$PATH:$WORKSPACE

            echo "Check installation"
            ./linux-amd64/helm help
            ./kubectl --help


            echo "configure kubectl client"
            curl https://sdk.cloud.google.com > install.sh
            chmod 700 install.sh
            ./install.sh --disable-prompts
            ~/google-cloud-sdk/bin/gcloud auth activate-service-account --key-file $GOOGLE_APPLICATION_CREDENTIALS
            ~/google-cloud-sdk/bin/gcloud container clusters get-credentials ${DEV2_GKE_CLUSTER_NAME} --region us-east4 --project dol-virtualassistant-dev
            echo "Test connection and check everything configured properly"
            ./kubectl get nodes
            ./linux-amd64/helm init --upgrade

            echo "clone the Helm chart repo"
            mkdir -p ~/.ssh
            ssh-keyscan innersource.accenture.com > ~/.ssh/known_hosts
            rm -rf jenkins-helm
            git clone ssh://git@innersource.accenture.com/ndollpcp/jenkins-helm.git
            ls -la 

            echo "Deploying service by Helm chart"
            export COMMIT_ID=$(cat ./commit.properties)
            ./linux-amd64/helm lint ./jenkins-helm/''' + serviceName + '''
            ./linux-amd64/helm upgrade -f ./jenkins-helm/''' + serviceName + '''/values-development.yaml ''' + serviceName + '''-dev --install --namespace ''' + dev2ClusterNamespace + ''' ./jenkins-helm/''' + serviceName + ''' --set image.repository="us.gcr.io/dol-virtualassistant-dev/converse3/$SERVICE_NAME" --set image.tag=$BUILD_NUMBER-$COMMIT_ID --set tracing.enabled=true
            #echo $?

          '''
        }
    }
  }
}

