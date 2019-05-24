#!/usr/bin/env bash

source ./scripts/variables.sh

FUNCTION_NAME=gmailTadpolesParser
ENTRYPOINT_NAME=subscrube
SOURCE_DIR=$(pwd)

echo "Function Name: ${FUNCTION_NAME}"
echo "Topic Name: ${TOPIC_NAME}"
echo "Source Dir: ${SOURCE_DIR}"

gcloud functions deploy $FUNCTION_NAME \
    --entry-point $ENTRYPOINT_NAME \
    --source $SOURCE_DIR \
    --runtime nodejs10 \
    --trigger-topic $TOPIC_NAME