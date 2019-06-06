const R = require('ramda');
const { spawn } = require('child_process');
const { google } = require('googleapis');
const readline = require('readline');
const { readFileAsync, writeFileAsync } = require('../fs.utils');

const SCOPES = [
	'https://www.googleapis.com/auth/gmail.readonly',           // Read GMail items
    'https://www.googleapis.com/auth/photoslibrary.readonly',   // Read GPhoto items
];

const isRunningOnOSX = () => process.platform === 'darwin';
const openBrowser = (url) => {
    spawn('open', [url])
        .on('error', (error) => console.error(`Error opening url: '${error}'`));
};

const makeOAuthClient = (credentials) => {
    const { client_secret, client_id, redirect_uris } = credentials.installed;

    return new google.auth.OAuth2(
        client_id,
        client_secret,
        redirect_uris[0],
    )
};

const authorize = R.curry(
    (tokenPath, credentials) =>
        Promise.resolve(makeOAuthClient(credentials))
            .then(oAuth2Client =>
                readTokenOrGetNew(tokenPath, oAuth2Client)
                    .then(token => oAuth2Client.setCredentials(token))
                    .then(() => oAuth2Client)
            )
);

const readTokenOrGetNew = (tokenPath, oAuth2Client) =>
    readFileAsync(tokenPath)
        .then(JSON.parse)
        .catch(() => getNewToken(tokenPath, oAuth2Client));

const getNewToken = R.curry(
    (tokenPath, oAuth2Client) => new Promise((resolve, reject) => {
	    const authUrl = oAuth2Client.generateAuthUrl({
		    access_type: 'offline',
		    scope: SCOPES,
	    });

	    if (isRunningOnOSX()) {
	        console.log('Opening browser to auth URL');
	        openBrowser(authUrl);
        } else {
            console.log('Authorize this app by visiting this url: \n', authUrl);
        }

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

                writeFileAsync(tokenPath, JSON.stringify(token))
                    .then(() => {
                        console.log('Token stored to', tokenPath);
                        resolve(token);
                    })
                    .catch((err) => {
                        console.error(err);
                        reject(err);
                    });
            });
        });
    })
);

const readCredentials = (credentialsFilePath) =>
    readFileAsync(credentialsFilePath)
        .then(JSON.parse);

const authWithCredentialsFile = (credentialsFilePath, tokenFilePath) =>
    readCredentials(credentialsFilePath)
        .then(authorize(tokenFilePath));

module.exports = {
	readCredentials,
    authorize,
    authWithCredentialsFile,
	getNewToken,
};
