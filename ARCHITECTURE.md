# Gmail Tadpoles Parser

This project is made up of a number of components.

## 1. The Cloud Pub/Sub watcher
This watches gmail for new email messages to come in that match
a certain set of labels.

Once an email matches the labels, an event is added to the 
cloud pubsub topic.

### Infrastructure
A topic needs to be created

### Configuration
The Cloub PubSub API needs to be enabled

### Permissions
Gmail needs permission to write to the topic

### Register Watcher
A watcher needs to be registered every 7 days to keep the 
subscription of the email messages active.

## 2. PubSub Listener
This cloud function is triggered when a new entry occurs in the
topic, the final "Email Parser" is triggered for the given event

## 3. Batch Processor
This triggers the email parser for every un-processed email
matching a given criteria.

## 4. The Email Parser
This script does the following.
a. Fetches Emails from Gmail
b. Parses the email text / html
c. downloads the images linked in the email
d. uploads these images to Google Photos