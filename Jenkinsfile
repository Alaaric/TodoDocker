pipeline {
  agent {
    docker {
      image 'node:22-alpine'
      args '-u root:root'
    }
  }
  
  stages {
    stage('Checkout') {
      steps {
        git branch: 'main', url: 'https://github.com/Alaaric/TodoDocker.git'
      }
    }
    
    stage('Install Dependencies') {
      steps {
        dir('frontend') {
          sh 'npm install'
        }
      }
    }
    
    stage('Run Tests') {
      steps {
        dir('frontend') {
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
  }
  
  post {
    always {
      cleanWs()
    }
  }
}
