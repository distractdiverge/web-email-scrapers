const R = require('ramda');
const { authWithCredentialsFile } = require('gmail-parser.core/services/google.client');
const gmailService = require('gmail-parser.core/services/gmail.service');
const emailService = require('gmail-parser.email-parser/email.service');
const downloadService = require('gmail-parser.email-parser/download.service');
const settings = require('./settings');

const getCredentialsPath = R.prop('credentials_path');
const getParserLabels = R.prop('label_names');

const promiseMap = R.curry((func, array) => Promise.all(R.map(func, array)));
const getId = R.prop('id');
const getMessageBody = R.path(['payload', 'body']);
const extractIdsFromLabels = R.map(getId);

const main = (googleConfig, parserConfig) =>
	authWithCredentialsFile(getCredentialsPath(googleConfig))
		.then((auth) =>
            gmailService.getLabelsByNames(auth, getParserLabels(parserConfig))
                .then(extractIdsFromLabels)
				.then(gmailService.getEmailsByLabel(auth))
				.then(promiseMap(message => gmailService.getEmail(auth, getId(message))))
				.then(promiseMap(message => emailService.parseEmail(getMessageBody(message))))
                .then(promiseMap(downloadService.downloadFiles))
				.then(messages => {
					console.log(' # MESSAGES ');
					messages.forEach((message => console.log(JSON.stringify(message))));
					console.log('\n\n');
				})
				.then(() => auth)
		)
		.catch(err => console.log('Error loading client secret file:', err));

if (require.main === module) {
    main(settings.getGoogleConfig(), settings.getParserConfig())
		.then(() => process.exit(0))
        .catch(err => {
            console.error(err);
            process.exit(1);
        });
}

module.exports = {
    main,
    promiseMap,
    getCredentialsPath,
    getParserLabels,
    getId,
    getMessageBody,
    extractIdsFromLabels,
};