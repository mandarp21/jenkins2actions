def call(String serviceName, String testClusterNamespace ){
  ansiColor('xterm') {
    unstash 'git-repo'
    sshagent(['adopssh']) {
        withCredentials([[$class: 'FileBinding', credentialsId: 'test-acn-ava-retcoach-hps', variable: 'GOOGLE_APPLICATION_CREDENTIALS']]) {
            sh '''#!/bin/bash -eux     
             
            
            echo "Install kubectl client"
            curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl
            chmod +x ./kubectl


            echo "Install Helm client"
            curl https://raw.githubusercontent.com/helm/helm/master/scripts/get > get_helm.sh
            chmod 700 get_helm.sh
            ./get_helm.sh
            export PATH=$PATH:$WORKSPACE

            echo "Check installation"
            helm help
            kubectl --help


            echo "configure kubectl client"
            curl https://sdk.cloud.google.com > install.sh
            chmod 700 install.sh
            ./install.sh --disable-prompts
            /root/google-cloud-sdk/bin/gcloud auth activate-service-account --key-file $GOOGLE_APPLICATION_CREDENTIALS
            /root/google-cloud-sdk/bin/gcloud container clusters get-credentials ${TEST_EKS_CLUSTER_NAME} --region us-east4 --project acn-ava-retcoach-hps-dlf
            echo "Test connection and check everything configured properly"
            kubectl get nodes
            helm init --upgrade

            echo "clone the Helm chart repo"
            mkdir -p /root/.ssh
            ssh-keyscan innersource.accenture.com > /root/.ssh/known_hosts
            rm -rf jenkins-helm
            git clone ssh://git@innersource.accenture.com/ndollpcp/jenkins-helm.git
            ls -la

            echo "Deploying service by Helm chart"
            export COMMIT_ID=$(cat ./commit.properties)
            helm lint ./jenkins-helm/''' + serviceName + '''
            helm upgrade -f ./jenkins-helm/''' + serviceName + '''/values-test.yaml ''' + serviceName + '''-test --install --namespace ''' + testClusterNamespace + ''' ./jenkins-helm/''' + serviceName + ''' --set image.repository="us.gcr.io/acn-ava-retcoach-hps-dlf/converse3/$SERVICE_NAME" --set image.tag=$BUILD_NUMBER-$COMMIT_ID --set tracing.enabled=true
            #echo $?

          '''
        }
    }
  }
}
