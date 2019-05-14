const { google } = require('googleapis');
const { readFileAsync } = require('./fs.utils');
const { authorize } = require('./google.client');
const settings = require('./settings');

const googleConfig = settings.getGoogleConfig();
const CREDENTIALS_PATH = googleConfig.credentials_path;

const listLabels = (auth) => new Promise((resolve, reject) => {
	const gmail = google.gmail({ version: 'v1', auth });


	gmail.users.labels.list(
		{
			userId: 'me',
		},
		(err, res) => {
			if (err) {
				console.log('The API returned an error', err);
				return reject(err);
			}

			const labels = res.data.labels;
			if (labels.length) {
				console.log('Labels:');
				labels.forEach((label) => {
					console.log(`- ${label.name}`);
				});
				resolve(labels);
			} else {
				console.log('No labels found');
				resolve([]);
			}
		});
});

const main = () =>
	readFileAsync(CREDENTIALS_PATH)
		.then(JSON.parse)
		.then(authorize)
		.then(listLabels)
		.catch(err => console.log('Error loading client secret file:', err));


if (require.main === module) {
	main()
		.then(() => process.exit())
}
