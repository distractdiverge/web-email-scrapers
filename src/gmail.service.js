const { google } = require('googleapis');

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
	)
});

module.exports = {
	getGmailClient,
	getLabels,
	getEmailsByLabel,
	getEmail,
};
