pipeline {
    agent any

    environment {
        // Your Docker Image names
        DOCKER_BACKEND_IMAGE = "chamod12/car-backend"
        DOCKER_FRONTEND_IMAGE = "chamod12/car-frontend"
        // Disable SSH host key checking for Ansible
        ANSIBLE_HOST_KEY_CHECKING = 'False'
    }

    stages {
        // -------------------------------
        // 1. Checkout Code from GitHub
        // -------------------------------
        stage('SCM Checkout') {
            steps {
                retry(3) {
                    git branch: 'main', url: 'https://github.com/HCAkalanka/devops.git'
                }
                script {
                    // Get short Commit ID (for Image Tag)
                    env.SHORT_COMMIT = sh(
                        script: 'git rev-parse --short=7 HEAD',
                        returnStdout: true
                    ).trim()
                    echo "Code checked out successfully"
                    echo "Image tag: ${env.SHORT_COMMIT}"
                }
            }
        }

        // -------------------------------
        // 2. Build Docker Images (Frontend & Backend)
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
        // 3. Push Docker Images to Docker Hub
        // -------------------------------
        stage('Push Docker Images') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'docker-hub-credentials', 
                    usernameVariable: 'DOCKER_USER', 
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    script {
                        // Login to Docker Hub
                        sh "echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin"

                        // 1. Backend Push (Commit ID & Latest Tag)
                        sh "docker push ${DOCKER_BACKEND_IMAGE}:${env.SHORT_COMMIT}"
                        sh "docker tag ${DOCKER_BACKEND_IMAGE}:${env.SHORT_COMMIT} ${DOCKER_BACKEND_IMAGE}:latest"
                        sh "docker push ${DOCKER_BACKEND_IMAGE}:latest"

                        // 2. Frontend Push (Commit ID & Latest Tag)
                        sh "docker push ${DOCKER_FRONTEND_IMAGE}:${env.SHORT_COMMIT}"
                        sh "docker tag ${DOCKER_FRONTEND_IMAGE}:${env.SHORT_COMMIT} ${DOCKER_FRONTEND_IMAGE}:latest"
                        sh "docker push ${DOCKER_FRONTEND_IMAGE}:latest"

                        // Logout
                        sh "docker logout"
                    }
                }
            }
        }

        // -------------------------------
        // 4. Deploy to Servers (Ansible)
        // -------------------------------
        stage('Deploy to Servers') {
            steps {
                dir('terraform') {
                    script {
                        echo "Deploying to Frontend and Backend servers..."
                        // Run Ansible Playbook
                        sh 'ansible-playbook -i inventory.ini deploy_app.yml'
                    }
                }
            }
        }
    }

    // -------------------------------
    // final step (Cleanup)
    // -------------------------------
    post {
        success {
            echo "Pipeline succeeded! Application deployed successfully. 🚀"
        }
        failure {
            echo "Pipeline failed. Please check the logs. ❌"
        }
        always {
            echo "Cleaning up local Docker images to save space..."
            sh "docker image prune -f || true"
        }
    }
}