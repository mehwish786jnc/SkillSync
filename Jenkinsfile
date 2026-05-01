pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 30, unit: 'MINUTES')
    }

    environment {
        REGISTRY        = credentials('docker-registry-url')
        REGISTRY_CREDS  = credentials('docker-registry-credentials')
        IMAGE_TAG       = "${env.BRANCH_NAME}-${env.BUILD_NUMBER}"
        DEPLOY_ENV      = "${env.BRANCH_NAME == 'main' ? 'production' : 'staging'}"
        KUBECONFIG_CRED = credentials('kubeconfig')
    }

    stages {
        // ── Build ────────────────────────────────────────────────
        stage('Build') {
            parallel {
                stage('Backend') {
                    agent {
                        docker { image 'node:20-alpine' }
                    }
                    steps {
                        dir('backend') {
                            sh 'npm ci'
                            sh 'npx prisma generate'
                            sh 'npm run build'
                        }
                    }
                }
                stage('Frontend') {
                    agent {
                        docker { image 'node:20-alpine' }
                    }
                    steps {
                        dir('frontend') {
                            sh 'npm ci'
                            sh 'npm run build'
                        }
                    }
                }
                stage('AI Service') {
                    agent {
                        docker { image 'python:3.11-slim' }
                    }
                    steps {
                        dir('ai-service') {
                            sh 'pip install --no-cache-dir -r requirements.txt'
                            sh 'python -m py_compile app/main.py'
                        }
                    }
                }
            }
        }

        // ── Test ─────────────────────────────────────────────────
        stage('Test') {
            parallel {
                stage('Backend Tests') {
                    agent {
                        docker { image 'node:20-alpine' }
                    }
                    steps {
                        dir('backend') {
                            sh 'npm ci'
                            sh 'npx prisma generate'
                            sh 'npm run test -- --ci --coverage'
                        }
                    }
                    post {
                        always {
                            junit allowEmptyResults: true, testResults: 'backend/coverage/junit.xml'
                            publishHTML(target: [
                                reportDir: 'backend/coverage/lcov-report',
                                reportFiles: 'index.html',
                                reportName: 'Backend Coverage'
                            ])
                        }
                    }
                }
                stage('Frontend Tests') {
                    agent {
                        docker { image 'node:20-alpine' }
                    }
                    steps {
                        dir('frontend') {
                            sh 'npm ci'
                            sh 'npm run test -- --run --coverage'
                        }
                    }
                    post {
                        always {
                            junit allowEmptyResults: true, testResults: 'frontend/coverage/junit.xml'
                        }
                    }
                }
                stage('AI Service Tests') {
                    agent {
                        docker { image 'python:3.11-slim' }
                    }
                    steps {
                        dir('ai-service') {
                            sh 'pip install --no-cache-dir -r requirements.txt'
                            sh 'pip install pytest pytest-asyncio pytest-cov'
                            sh 'pytest --junitxml=report.xml --cov=app --cov-report=xml'
                        }
                    }
                    post {
                        always {
                            junit allowEmptyResults: true, testResults: 'ai-service/report.xml'
                        }
                    }
                }
                stage('Lint') {
                    agent {
                        docker { image 'node:20-alpine' }
                    }
                    steps {
                        dir('backend') {
                            sh 'npm ci'
                            sh 'npm run lint || true'
                        }
                        dir('frontend') {
                            sh 'npm ci'
                            sh 'npm run lint || true'
                        }
                    }
                }
            }
        }

        // ── Dockerize ────────────────────────────────────────────
        stage('Dockerize') {
            steps {
                script {
                    docker.withRegistry("https://${REGISTRY}", 'docker-registry-credentials') {
                        parallel(
                            backend: {
                                def backendImg = docker.build(
                                    "${REGISTRY}/skillsync-backend:${IMAGE_TAG}",
                                    "-f infra/docker/backend.Dockerfile ."
                                )
                                backendImg.push()
                                backendImg.push('latest')
                            },
                            frontend: {
                                def frontendImg = docker.build(
                                    "${REGISTRY}/skillsync-frontend:${IMAGE_TAG}",
                                    "-f infra/docker/frontend.Dockerfile ."
                                )
                                frontendImg.push()
                                frontendImg.push('latest')
                            },
                            'ai-service': {
                                def aiImg = docker.build(
                                    "${REGISTRY}/skillsync-ai-service:${IMAGE_TAG}",
                                    "-f infra/docker/ai-service.Dockerfile ."
                                )
                                aiImg.push()
                                aiImg.push('latest')
                            }
                        )
                    }
                }
            }
        }

        // ── Deploy ───────────────────────────────────────────────
        stage('Deploy') {
            when {
                anyOf {
                    branch 'main'
                    branch 'staging'
                }
            }
            steps {
                script {
                    withCredentials([file(credentialsId: 'kubeconfig', variable: 'KUBECONFIG')]) {
                        sh """
                            kubectl set image deployment/skillsync-backend \
                                backend=${REGISTRY}/skillsync-backend:${IMAGE_TAG} \
                                --namespace=skillsync-${DEPLOY_ENV}

                            kubectl set image deployment/skillsync-frontend \
                                frontend=${REGISTRY}/skillsync-frontend:${IMAGE_TAG} \
                                --namespace=skillsync-${DEPLOY_ENV}

                            kubectl set image deployment/skillsync-ai-service \
                                ai-service=${REGISTRY}/skillsync-ai-service:${IMAGE_TAG} \
                                --namespace=skillsync-${DEPLOY_ENV}

                            kubectl rollout status deployment/skillsync-backend \
                                --namespace=skillsync-${DEPLOY_ENV} --timeout=120s

                            kubectl rollout status deployment/skillsync-frontend \
                                --namespace=skillsync-${DEPLOY_ENV} --timeout=120s

                            kubectl rollout status deployment/skillsync-ai-service \
                                --namespace=skillsync-${DEPLOY_ENV} --timeout=120s
                        """
                    }
                }
            }
        }
    }

    post {
        success {
            echo "Pipeline succeeded for ${env.BRANCH_NAME} (build #${env.BUILD_NUMBER})"
        }
        failure {
            echo "Pipeline FAILED for ${env.BRANCH_NAME} (build #${env.BUILD_NUMBER})"
            // Uncomment to enable Slack notifications:
            // slackSend(channel: '#deploys', color: 'danger',
            //     message: "FAILED: ${env.JOB_NAME} #${env.BUILD_NUMBER} (<${env.BUILD_URL}|Open>)")
        }
        always {
            cleanWs()
        }
    }
}
