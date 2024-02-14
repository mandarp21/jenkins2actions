def call(String serviceName, String sitClusterNamespace ){
  ansiColor('xterm') {
    unstash 'git-repo'
    sshagent(['adopssh']) {
        withCredentials([[$class: 'FileBinding', credentialsId: 'devops', variable: 'GOOGLE_APPLICATION_CREDENTIALS']]) {
            sh '''#!/bin/bash -eux     
             
            
            echo "Install kubectl client"
            curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl
            chmod +x ./kubectl


            echo "Install Helm client"
            curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 > get-helm-3.sh
            chmod 700 get-helm-3.sh
            ./get-helm-3.sh
            
            export PATH=$PATH:$WORKSPACE

            echo "Check installation"
            helm help
            kubectl --help


            echo "configure kubectl client"
            curl https://sdk.cloud.google.com > install.sh
            chmod 700 install.sh
            ./install.sh --disable-prompts
            /root/google-cloud-sdk/bin/gcloud auth activate-service-account --key-file $GOOGLE_APPLICATION_CREDENTIALS
            /root/google-cloud-sdk/bin/gcloud container clusters get-credentials ${SIT_GKE_CLUSTER_NAME} --region us-west4 --project acn-newyork-dol-gcp
            echo "Test connection and check everything configured properly"
            kubectl get nodes
            

            echo "clone the Helm chart repo"
            mkdir -p /root/.ssh
            ssh-keyscan innersource.accenture.com > /root/.ssh/known_hosts
            rm -rf jenkins-helm
            git clone ssh://git@innersource.accenture.com/ndollpcp/jenkins-helm.git
            ls -la 

            echo "Deploying service by Helm chart"
            export COMMIT_ID=$(cat ./commit.properties)
            helm lint ./jenkins-helm/''' + serviceName + '''
            helm upgrade -f ./jenkins-helm/''' + serviceName + '''/values-sit.yaml ''' + serviceName + '''-sit --install --namespace ''' + sitClusterNamespace + ''' ./jenkins-helm/''' + serviceName + ''' --set image.repository="us.gcr.io/acn-newyork-dol-gcp/converse3/$SERVICE_NAME" --set image.tag=$BUILD_NUMBER-$COMMIT_ID --set tracing.enabled=true
            #echo $?

          '''
        }
    }
  }
}

