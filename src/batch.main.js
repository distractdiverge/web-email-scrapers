const R = require('ramda');
const { authWithCredentialsFile } = require('./services/google.client');
const downloadService = require('./services/download.service');
const gmailService = require('./services/gmail.service');
const emailService = require('./services/email.service');
const settings = require('./utilities/settings');

const googleConfig = settings.getGoogleConfig();
const CREDENTIALS_PATH = googleConfig.credentials_path;

const promiseMap = R.curry((func, array) => Promise.all(R.map(func, array)));

const main = () =>
	authWithCredentialsFile(CREDENTIALS_PATH)
		.then((auth) =>

            gmailService.getLabelsByNames(auth, ['Tadpoles', 'to-process'])
                .then(R.map(R.prop('id')))
				.then(gmailService.getEmailsByLabel(auth))
				.then(promiseMap(message => gmailService.getEmail(auth, R.prop('id', message))))
				.then(promiseMap(message => emailService.parseEmail(R.path(['payload', 'body'], message))))
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
	main()
		.then(() => process.exit())
}
