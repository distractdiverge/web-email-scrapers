#!/usr/bin/env bash

PROJECT_NAME="quickstart-1556590072085"
TOPIC_NAME="test-gmail-topic"
TOPIC_PATH="projects/$PROJECT_NAME/topics/$TOPIC_NAME"

echo "Checking existing Permissions"
gcloud beta pubsub topics get-iam-policy $TOPIC_PATH

echo ""
echo "Setting New Policy"
gcloud beta pubsub topics set-iam-policy $TOPIC_PATH gmail-publish-policy.json


