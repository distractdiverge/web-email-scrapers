const { google } = require('googleapis');
const { simpleParser } = require('mailparser');

const getGmailClient = (auth) => google.gmail({ version: 'v1', auth });

const getLabels = (auth) => new Promise(
	(resolve, reject) =>
				getGmailClient(auth)
					.users
					.labels
					.list({ userId: 'me' }, (err, res) => err ? reject(err) : resolve(res.data.labels))
);

const getEmailsByLabel = (auth, labelIds) => new Promise((resolve, reject) => {

	const client = getGmailClient(auth);

	// TODO: Take in label names & match against list of labels

	return client.users.messages.list(
		{ userId: 'me', labelIds, },
		(err, res) => err ? reject(err) : resolve(res.data.messages)
	);
});

const getEmail = (auth, messageId) => new Promise((resolve, reject) => {
	const client = getGmailClient(auth);

	return client.users.messages.get(
		{ userId: 'me', id: messageId },
		(err, res) => err ? reject(err) : resolve(res.data)
		// TODO: Parse Mime Body of email (res.data.payload.body.data
	)
})
	.then(message => parseEmail(message))
	// TODO: Extract HTML from Message
	// TODO: Parse HTML via Cherio
	// TODO: Extract Img Links from HTML
	// TODO: Create list of links to change (to download links)
	// TODO: Return Download Links
	// TODO: Take all of these actions & move them to their own "service"
	.then(something => something);

const parseEmail = (message) => {
	if (message.payload.body.size === 0) {
		return Promise.resolve(undefined);
	}

	const rawData = message.payload.body.data;
	const encodedData = (new Buffer(rawData, 'base64')).toString('ascii');
	const data = decodeURIComponent(escape(encodedData));

	return simpleParser(data);
};

module.exports = {
	getGmailClient,
	getLabels,
	getEmailsByLabel,
	getEmail,
};
