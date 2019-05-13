const { google } = require('googleapis');
const readline = require('readline');
const settings = require('./settings'); // TODO: Remove file dependence to argument of functions
const fs = require('fs');
const { readFileAsync } = require('./fs.utils');

const SCOPES = [
	'https://www.googleapis.com/auth/gmail.readonly'
];

const googleConfig = settings.getGoogleConfig();

const TOKEN_PATH = googleConfig.token_path;

const fetchToken = (credentials) => {
	const { client_secret, client_id, redirect_uris } = credentials.installed;

	const oAuth2Client = new google.auth.OAuth2(
		client_id, client_secret, redirect_uris[0]
	);

	return getNewToken(oAuth2Client);
};

const authorize = (credentials) => {
	const { client_secret, client_id, redirect_uris } = credentials.installed;

	const oAuth2Client = new google.auth.OAuth2(
		client_id, client_secret, redirect_uris[0]
	);

	return readFileAsync(TOKEN_PATH)
		.then(JSON.parse)
		.then(oAuth2Client.setCredentials)
		.then(() => oAuth2Client);
};


const getNewToken = (oAuth2Client) => new Promise((resolve, reject) => {
	const authUrl = oAuth2Client.generateAuthUrl({
		access_type: 'offline',
		scope: SCOPES,
	});

	console.log('Authorize this app by visiting this url: ', authUrl);
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});
	rl.question('Enter the code from that page here: ', (code) => {
		rl.close();
		oAuth2Client.getToken(code, (err, token) => {
			if (err) {
				console.error('Error retrieving access token', err);
				reject(err);
			}

			fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
				if (err) {
					console.error(err);
					reject(err);
				}
				console.log('Token stored to', TOKEN_PATH);
				resolve(token);
			});
		});
	});
});

module.exports = {
	authorize,
	fetchToken,
	getNewToken,
};
