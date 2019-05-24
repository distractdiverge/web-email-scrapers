#!/usr/bin/env bash

source ./variables.sh

echo "Checking existing Permissions"
gcloud beta pubsub topics get-iam-policy $TOPIC_PATH

echo ""
echo "Setting New Policy"
gcloud beta pubsub topics set-iam-policy $TOPIC_PATH gmail-publish-policy.json


