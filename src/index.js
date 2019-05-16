const { readFileAsync } = require('./fs.utils');
const { authorize } = require('./google.client');
const gmailService = require('./gmail.service');
const emailService = require('./email.service');
const settings = require('./settings');

const googleConfig = settings.getGoogleConfig();
const CREDENTIALS_PATH = googleConfig.credentials_path;

const main = () =>
	readFileAsync(CREDENTIALS_PATH)
		.then(JSON.parse)
		.then(authorize)
		.then((auth) =>

			gmailService.getLabels(auth)
				.then((labels) => {
					console.log(' # LABELS');
					labels.forEach(label => {
						console.log(JSON.stringify(label));
					});
					console.log('\n\n');
				})
				.then(() => gmailService.getEmailsByLabel(auth, ['Label_9180442277909378761', 'Label_7306260070784252485']))
				.then((messages) => Promise.all(messages.map((message) => gmailService.getEmail(auth, message.id))))
				.then((messages) => Promise.all(messages.map((message) => emailService.parseEmail(message.payload.body))))
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
