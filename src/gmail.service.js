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

const getEmailsByLabel = R.curry((auth, labelIds) => new Promise((resolve, reject) =>

	// TODO: Take in label names & match against list of labels

	getGmailClient(auth).users.messages.list(
		{ userId: 'me', labelIds, },
		(err, res) => err ? reject(err) : resolve(res.data.messages)
	)
));

const getEmail = (auth, messageId) => new Promise((resolve, reject) =>
	getGmailClient(auth).users.messages.get(
		{ userId: 'me', id: messageId },
		(err, res) => err ? reject(err) : resolve(res.data)
	)
);

// TODO: Grant pernmissions (to allow this call)
const registerGmailWatcher = R.curry((auth, topicName, labelIds) =>
    new Promise((resolve, reject) =>
        getGmailClient(auth)
            .users
            .watch(
                {
                    auth,
                    userId: 'me',
                    resource: {
                        topicName,
                        labelIds,
                    }
                },
                (err, res) => err ? reject(err) : resolve(res)
            )
    )
);

module.exports = {
    findLabelByName,
    getLabelByName,
    getLabelsByNames,
	getGmailClient,
	getLabels,
	getEmailsByLabel,
	getEmail,
    registerGmailWatcher,
};
