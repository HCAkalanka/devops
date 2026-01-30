pipeline {
    agent any

    environment {
        DOCKER_BACKEND_IMAGE = "chamod12/car-backend"
        DOCKER_FRONTEND_IMAGE = "chamod12/car-frontend"
    }

    stages {
        // -------------------------------
        stage('SCM Checkout') {
            steps {
                retry(3) {
                    git branch: 'main', url: 'https://github.com/HCAkalanka/devops.git'
                }
                script {
                    env.SHORT_COMMIT = sh(
                        script: 'git rev-parse --short=7 HEAD',
                        returnStdout: true
                    ).trim()
                    echo "ode checked out successfully"
                    echo " Image tag: ${env.SHORT_COMMIT}"
                }
            }
        }

        // -------------------------------
        stage('Build Docker Images') {
            parallel {
                stage('Backend') {
                    steps {
                        dir('backend') {
                            script {
                                def backendImage = "${DOCKER_BACKEND_IMAGE}:${env.SHORT_COMMIT}"
                                echo "Building backend Docker image: ${backendImage}"
                                sh "docker build -t ${backendImage} ."
                            }
                        }
                    }
                }
                stage('Frontend') {
                    steps {
                        dir('frontend') {
                            script {
                                def frontendImage = "${DOCKER_FRONTEND_IMAGE}:${env.SHORT_COMMIT}"
                                echo "Building frontend Docker image: ${frontendImage}"
                                sh "docker build --network=host -t ${frontendImage} ."
                            }
                        }
                    }
                }
            }
        }

        // -------------------------------
        stage('Push Docker Images') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'cred', 
                    usernameVariable: 'DOCKER_USER', 
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    script {
                        // Login to Docker Hub
                        sh "echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin"

                        // Push backend image
                        def backendImage = "${DOCKER_BACKEND_IMAGE}:${env.SHORT_COMMIT}"
                        sh "docker push ${backendImage}"

                        // Push frontend image
                        def frontendImage = "${DOCKER_FRONTEND_IMAGE}:${env.SHORT_COMMIT}"
                        sh "docker push ${frontendImage}"

                        // Optionally tag as latest
                        sh "docker tag ${backendImage} ${DOCKER_BACKEND_IMAGE}:latest || true"
                        sh "docker push ${DOCKER_BACKEND_IMAGE}:latest || true"

                        sh "docker tag ${frontendImage} ${DOCKER_FRONTEND_IMAGE}:latest || true"
                        sh "docker push ${DOCKER_FRONTEND_IMAGE}:latest || true"

                        // Logout
                        sh "docker logout"
                    }
                }
            }
        }
    }

    // -------------------------------
    post {
        success {
            echo " Pipeline succeeded!"
            echo "Backend image: ${DOCKER_BACKEND_IMAGE}:${env.SHORT_COMMIT}"
            echo "Frontend image: ${DOCKER_FRONTEND_IMAGE}:${env.SHORT_COMMIT}"
        }
        failure {
            echo "pipeline failed. Check the console output for errors."
        }
        always {
            echo "Cleaning up local Docker images (optional)"
            sh "docker image prune -f || true"
        }
    }
}