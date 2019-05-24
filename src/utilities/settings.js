const convict = require('convict');
const dotenv = require('dotenv');

dotenv.config();

const config = convict({
	env: {
		desc: 'NodeJS Environment',
		default: 'development',
		format: [
			'development',
			'production',
			'test',
		],
		env: 'NODE_ENV'
	},

	google: {
		token_path: {
			desc: 'Path to an OAuth2 \'Auth Token\'',
			default: './token.json',
			format: 'String',
			env: 'OAUTH_TOKEN_PATH',
		},
		credentials_path: {
			desc: 'Path to an Service Credentials',
			default: './credentials.json',
			format: 'String',
			env: 'GOOGLE_CREDENTIALS_PATH',
		},
        pubsub_topic_name: {
		    desc: 'Full name of the cloud pubsub topic',
            default: undefined,
            format: 'String',
            env: 'GMAIL_PUBSUB_TOPIC_NAME',
        },
        label_names: {
		    desc: 'List of labels to include in the gmail watcher',
            default: [],
            format: 'Array',
            env: 'GMAIL_LABELS',
        },
	},
});


const getEnv = () => config.get('env');
const getGoogleConfig = () => config.get('google');

module.exports = {
	getEnv,
	getGoogleConfig,
};
