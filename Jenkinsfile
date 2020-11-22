node {
    def app

    stage('Clone Repository') {
        /* Let's make sure we have the repository cloned to our workspace */

        checkout scm
    }

    stage('Build Image') {
        /* This builds the actual image; synonymous to
         * docker build on the command line */

        app = docker.build("ac365d7/mvp")
    }

    stage('Test Image') {
        /* Ideally, we would run a test framework against our image.
         * For this example, we're using a Volkswagen-type
         approach ;-) */

        app.inside {
            sh 'echo "Tests Passed"'
        }
    }

    stage('Push Image') {
        /* Finally, we'll push the image with two tags:
         * First, the incremental build number from Jenkins
         * Second, the 'latest' tag.
         * Pushing multiple tags is cheap, as all the layers are reused. */
   
docker.withRegistry('https://registry.hub.docker.com', 'docker-hub-credentials') {
            app.push("${env.BUILD_NUMBER}")
            app.push("latest")
        }
    }
}