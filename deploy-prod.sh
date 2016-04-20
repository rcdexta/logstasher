#!/usr/bin/env bash

echo "Building files..."
gulp build-prod

echo "Packaging files..."
rm -rf /tmp/logstasher.tar
tar --exclude={node_modules,.git,.idea} -czvf /tmp/logstasher.tar .

echo "Deploying to ElasticBeanstalk..."
scp -r -i ~/.ssh/build-oregon-key.pem /tmp/logstasher.tar ubuntu@54.68.194.10:/tmp
ssh -i ~/.ssh/build-oregon-key.pem ubuntu@54.68.194.10 "rm -rf logstasher && mkdir logstasher"
ssh -i ~/.ssh/build-oregon-key.pem ubuntu@54.68.194.10 "cd logstasher && tar xvf /tmp/logstasher.tar"
ssh -i ~/.ssh/build-oregon-key.pem ubuntu@54.68.194.10 "sudo service nginx restart"

echo "Done!"
