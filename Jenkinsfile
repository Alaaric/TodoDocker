pipeline {
  agent any
  
  triggers {
    pollSCM('* * * * *')
  }
  
  environment {
    REGISTRY = 'ghcr.io'
    OWNER = 'alaaric'
    REPO = 'tododocker'
    GITHUB_OWNER = 'Alaaric'
    GITHUB_REPO = 'TodoDocker'
  }
  
  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }
    
    stage('Run Tests') {
      agent {
        docker {
          image 'node:22-alpine'
          args '-u root:root'
        }
      }
      steps {
        dir('frontend') {
          sh 'npm ci'
          sh 'npm run test:coverage'
        }
      }
      post {
        always {
          publishHTML([
            allowMissing: false,
            alwaysLinkToLastBuild: true,
            keepAll: true,
            reportDir: 'frontend/coverage',
            reportFiles: 'index.html',
            reportName: 'Coverage Report'
          ])
        }
      }
    }
    
    stage('Build Docker Images') {
      when {
        expression { currentBuild.result != 'FAILURE' }
      }
      steps {
        script {
          def version = "v1.0.${BUILD_NUMBER}"
          env.VERSION = version
          
          sh 'docker-compose build'
          
          sh """
            docker tag tododocker-frontend:latest ${REGISTRY}/${OWNER}/${REPO}-frontend:${version}
            docker tag tododocker-frontend:latest ${REGISTRY}/${OWNER}/${REPO}-frontend:latest
            docker tag tododocker-backend:latest ${REGISTRY}/${OWNER}/${REPO}-backend:${version}
            docker tag tododocker-backend:latest ${REGISTRY}/${OWNER}/${REPO}-backend:latest
          """
        }
      }
    }
    
    stage('Push to GitHub Packages') {
      when {
        expression { currentBuild.result != 'FAILURE' }
      }
      steps {
        withCredentials([usernamePassword(credentialsId: 'GH-token', usernameVariable: 'GITHUB_USER', passwordVariable: 'GITHUB_TOKEN')]) {
          script {
            sh """
              echo \$GITHUB_TOKEN | docker login ${REGISTRY} -u \$GITHUB_USER --password-stdin
              
              # Push frontend images
              docker push ${REGISTRY}/${OWNER}/${REPO}-frontend:${VERSION}
              docker push ${REGISTRY}/${OWNER}/${REPO}-frontend:latest
              
              # Push backend images
              docker push ${REGISTRY}/${OWNER}/${REPO}-backend:${VERSION}
              docker push ${REGISTRY}/${OWNER}/${REPO}-backend:latest
            """
          }
        }
      }
    }
    
    stage('Tag Repository') {
      when {
        expression { currentBuild.result != 'FAILURE' }
      }
      steps {
        withCredentials([usernamePassword(credentialsId: 'GH-token', usernameVariable: 'GITHUB_USER', passwordVariable: 'GITHUB_TOKEN')]) {
          script {
            sh """
              git config user.name "Jenkins"
              git config user.email "jenkins@ci.local"
              git tag -a ${VERSION} -m "Release ${VERSION} - Build ${BUILD_NUMBER}"
              git push https://\$GITHUB_TOKEN@github.com/${GITHUB_OWNER}/${GITHUB_REPO}.git ${VERSION}
            """
          }
        }
      }
    }
  }
  
  post {
    always {
      script {
        if (env.VERSION) {
          sh """
            docker rmi ${REGISTRY}/${OWNER}/${REPO}-frontend:${VERSION} || true
            docker rmi ${REGISTRY}/${OWNER}/${REPO}-frontend:latest || true
            docker rmi ${REGISTRY}/${OWNER}/${REPO}-backend:${VERSION} || true
            docker rmi ${REGISTRY}/${OWNER}/${REPO}-backend:latest || true
            docker logout ${REGISTRY} || true
          """
        } else {
          sh "docker logout ${REGISTRY} || true"
        }
      }
      cleanWs()
    }
    success {
      echo "Success!"
      echo "Repository tagged: ${VERSION}"
      echo "Docker images available at:"
      echo "   ${REGISTRY}/${OWNER}/${REPO}-frontend:${VERSION}"
      echo "   ${REGISTRY}/${OWNER}/${REPO}-backend:${VERSION}"
    }
    failure {
      echo "Failed!"
    }
  }
}
