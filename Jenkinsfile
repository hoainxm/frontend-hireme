def currentBranch = ""
def currentTag = ""
def currentVersion = ""
def docker_tag
def docker_image

pipeline {
    agent { label 'frontend' }
    options {
        buildDiscarder(logRotator(
            daysToKeepStr: '30', // days
            numToKeepStr: '10' // builds
        ))
        //parallelsAlwaysFailFast()
        timestamps()
    }
    triggers {
        pollSCM('*/10 * * * *') // poll every 10 mins
    }

    stages {
        stage('Init') {
            steps {
                notifyBuild('STARTED')
                script {
                    currentTag = env.TAG_NAME;
                    currentVersion = env.TAG_NAME;
                    currentBranch = env.TAG_NAME;
                }
            }
        }

        stage('Checkout') {
            steps {
                //checkout scm
                sh "rm -rf ${currentTag}"
                sh "git clone git@gitlab.tma.com.vn:tmaaicloud/frontend.git --tags ${currentTag} --branch ${currentTag} --depth 1 --single-branch"
            }
        }

        stage('Unit Testing') {
            steps {
                sh """
                echo "Running Unit Testing"
                """
            }
        }

        stage('Analysis') {
            steps {
                script {
                    def scannerHome = tool 'sonar-scanner-tool'
                    withSonarQubeEnv(installationName: 'sonarqube-server') {
                        withCredentials([string(credentialsId: 'sonarqube-local-id', variable: 'SONARQUBE_TOKEN')]) {
                            dir(currentTag) {
                                sh "${scannerHome}/bin/sonar-scanner \
                                    -Dsonar.projectKey=aic-frontend-${currentBranch} \
                                    -Dsonar.token=${SONARQUBE_TOKEN}"
                            }
                        }
                    }
                }
            }
        }

        stage('Build Image') {
            steps {
                script {
                    dir(currentTag) {
                        def version = currentTag.split('-v')[1];
                        docker_tag = "tmainnovation/ac-website:${version}"
                        docker_image = docker.build("${docker_tag}", "-f Dockerfile .")
                    }
                }
            }
        }

        stage('Download Snyk') {
            steps {
                sh '''
                    snyk_version=$SNYK_VERSION
                    snyk_cli_dl_linux="https://github.com/snyk/snyk/releases/download/${snyk_version}/snyk-linux"
                    echo "Download URL: ${snyk_cli_dl_linux}"
                    curl -Lo ./snyk "${snyk_cli_dl_linux}"
                    chmod +x snyk
                    ./snyk -v
                '''
            }
        }
    

        stage('Scan Image') {
            steps {
                // sh "npm install snyk-to-html -g"
                sh "./snyk container test ${docker_tag} --file=${currentTag}/Dockerfile --json | snyk-to-html -o snyk-container-report-v${currentVersion}.html"
                // sh "./snyk container test ${docker_tag} --file=${currentTag}/Dockerfile --json-file-output=snyk-report-v${currentVersion}.json"
            }
        }
        
        stage('Push & Cleanup') {
            steps {
                script {
                    docker.withRegistry("https://registry.docker.com", "hub-docker-registry-id") {
                        dir(currentTag) {
                            docker_image.push()
                            sh "docker rmi ${docker_image.id}"
                        }
                    }
                }
            }
        }
        stage('Deployment') {
            steps {
                sh """
                echo "Deployment"
                """
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: '*.html', fingerprint: true
            notifyBuild(currentBuild.result)
            cleanWs()
        }
    }   
}

def notifyBuild(String buildStatus = 'STARTED') {
  // build status of null means successful
  buildStatus = buildStatus ?: 'SUCCESS'

  // Default values
  def colorName = 'RED'
  def colorCode = '#FF0000'
  def subject = "${buildStatus}: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'"
  def summary = "${subject} (${env.BUILD_URL})"
  def details = """<p>STARTED: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]':</p>
    <p>Check console output at &QUOT;<a href='${env.BUILD_URL}'>${env.JOB_NAME} [${env.BUILD_NUMBER}]</a>&QUOT;</p>"""

  // Override default values based on build status
  if (buildStatus == 'STARTED') {
    color = 'YELLOW'
    colorCode = '#FFFF00'
  } else if (buildStatus == 'SUCCESS') {
    color = 'GREEN'
    colorCode = '#00FF00'
  } else {
    color = 'RED'
    colorCode = '#FF0000'
  }

  // Send notifications
  emailext (
      subject: subject,
      body: details,
      recipientProviders: [[$class: 'DevelopersRecipientProvider']]
    )
}
