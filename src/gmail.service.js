const { google } = require('googleapis');
const R = require('ramda');

const getGmailClient = (auth) => google.gmail({ version: 'v1', auth });

const findLabelByName = R.curry(
    (name, labels) => R.find(
        R.eqBy(
            R.pipe(
                R.prop('name'),
                R.toLower
            ),
            R.objOf('name', name)
        ),
        labels
    )
);

const getLabelByName = (auth, labelName) =>
  getLabels(auth)
      .then(findLabelByName(labelName));

const getLabelsByNames = (auth, labelNames) =>
    getLabels(auth)
        .then(labels =>
            R.map(
                labelName => findLabelByName(labelName, labels),
                labelNames
            )
        );

const getLabels = (auth) => new Promise(
	(resolve, reject) =>
				getGmailClient(auth)
					.users
					.labels
					.list({ userId: 'me' }, (err, res) => err ? reject(err) : resolve(res.data.labels))
);

const getEmailsByLabel = R.curry((auth, labelIds) => new Promise((resolve, reject) => {

	const client = getGmailClient(auth);

	// TODO: Take in label names & match against list of labels

	return client.users.messages.list(
		{ userId: 'me', labelIds, },
		(err, res) => err ? reject(err) : resolve(res.data.messages)
	);
}));

const getEmail = (auth, messageId) => new Promise((resolve, reject) => {
	const client = getGmailClient(auth);

	return client.users.messages.get(
		{ userId: 'me', id: messageId },
		(err, res) => err ? reject(err) : resolve(res.data)
	)
});

module.exports = {
    findLabelByName,
    getLabelByName,
    getLabelsByNames,
	getGmailClient,
	getLabels,
	getEmailsByLabel,
	getEmail,
};
