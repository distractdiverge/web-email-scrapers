const R = require('ramda');
const { authWithCredentialsFile } = require('../../gmail-parser.core/src/services/google.client');
const gmailService = require('../../gmail-parser.core/src/services/gmail.service');
const settings = require('../../gmail-parser.core/src/settings');

const getCredentialsPathFromSettings = R.prop('credentials_path');
const getTopicFromSettings = R.prop('pubsub_topic_name');
const getLabelsFromSettings = R.prop('label_names');

const register = R.curry(
    (labelNames, pubsubTopic, auth) => {

        // Get Label Ids
        return gmailService.getLabelsByNames(auth, labelNames)
            .then(R.map(R.prop('id')))
            .then(labelIds => gmailService.registerGmailWatcher(auth, pubsubTopic, labelIds))
            .then(res => {
                console.log(res);
            })
});

const main = (settings) =>
    authWithCredentialsFile(getCredentialsPathFromSettings(settings))
        .then(
            register(
                getLabelsFromSettings(settings),
                getTopicFromSettings(settings)
            )
        );

if (require.main === module) {
    main(settings.getGoogleConfig())
        .then(() => process.exit(0))
        .catch((err) => {
            console.error(err.message);
            process.exit(1);
        })
}

module.exports = {
    main,
    register,
};