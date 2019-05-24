const { google } = require('googleapis/build/src/index');
const readline = require('readline');
const settings = require('../utilities/settings'); // TODO: Remove file dependence to argument of functions
const { readFileAsync, writeFileAsync } = require('../utilities/fs.utils');

const SCOPES = [
	'https://www.googleapis.com/auth/gmail.readonly',           // Read GMail items
    'https://www.googleapis.com/auth/photoslibrary.readonly',   // Read GPhoto items
];

const googleConfig = settings.getGoogleConfig();
const TOKEN_PATH = googleConfig.token_path;

const makeOAuthClient = (credentials) => {
    const { client_secret, client_id, redirect_uris } = credentials.installed;

    return new google.auth.OAuth2(
        client_id,
        client_secret,
        redirect_uris[0],
    )
};

const authorize = (credentials) => {
	const oAuth2Client = makeOAuthClient(credentials);

	return readFileAsync(TOKEN_PATH)
		.then(content => JSON.parse(content))
        .catch(() => getNewToken(oAuth2Client))
		.then(token => oAuth2Client.setCredentials(token))
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

			writeFileAsync(TOKEN_PATH, JSON.stringify(token))
                .then(() => {
                    console.log('Token stored to', TOKEN_PATH);
                    resolve(token);
                })
                .catch((err) => {
                    console.error(err);
                    reject(err);
                });
		});
	});
});

const readCredentials = (credentialsFilePath) =>
    readFileAsync(credentialsFilePath)
        .then(JSON.parse);

const authWithCredentialsFile = (filepath) =>
    readCredentials(filepath)
        .then(authorize);

module.exports = {
	readCredentials,
    authorize,
    authWithCredentialsFile,
	getNewToken,
};
