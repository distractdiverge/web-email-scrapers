const R = require('ramda');
const { authWithCredentialsFile } = require('gmail-parser.core/services/google.client');
const gmailService = require('gmail-parser.core/services/gmail.service');
const emailService = require('gmail-parser.email-parser/email.service');
const downloadService = require('gmail-parser.email-parser/download.service');
const settings = require('./settings');

const getCredentialsPath = R.prop('credentials_path');
const getTokenPath = R.prop('token_path');
const getGmailLabelNames = R.prop('label_names');

const promiseMap = R.curry((func, array) => Promise.all(R.map(func, array)));
const getId = R.prop('id');
const extractIdsFromLabels = R.map(getId);

const getLabels = (auth, labelNames) =>
    gmailService.getLabelsByNames(auth, labelNames)
        .then(extractIdsFromLabels);

const getEmailsByLabelNames = (auth, labelNames) =>
    getLabels(auth, labelNames)
        .then(gmailService.getEmailsByLabelIds(auth))
        .then(promiseMap(message => gmailService.getEmail(auth, getId(message))));

const parseEmailsAndDowloadImages = (emails) => {
    return promiseMap(emailService.extractLinksFromEmail, emails)
        .then(parsedEmails => {
            console.log(' # MESSAGES ');
            for (let i = 0; i < parsedEmails.length; i++) {
                let links = parsedEmails[i];
                console.log(`## Email[${i}] Links:`)
                for (let j = 0; j < links.length; j++) {
                    console.log(`\t ${links[j]}`);
                }
            }
            console.log('\n\n');
            return parsedEmails;
        })
        .then(promiseMap(downloadService.downloadFiles))
};

const main = (googleConfig, parserConfig) =>
	authWithCredentialsFile(getCredentialsPath(googleConfig), getTokenPath(googleConfig))
		.then((auth) =>
            getEmailsByLabelNames(auth, getGmailLabelNames(parserConfig))
                .then(parseEmailsAndDowloadImages)
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
    getParserLabels: getGmailLabelNames,
    getId,
    getMessageBody,
    extractIdsFromLabels,
};