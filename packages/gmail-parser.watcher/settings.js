const convict = require('convict');
const dotenv = require('dotenv');
dotenv.config();

const config = convict({
    google: {
        credentials_path: {
            desc: 'Path to an Service Credentials',
            default: './credentials.json',
            format: 'String',
            env: 'GOOGLE_CREDENTIALS_PATH',
        },
    },
    parser: {
        pubsub_topic_name: {
            desc: 'Name of the google cloud pubsub topic name for gmail.',
            default: undefined,
            format: 'String',
            env: 'GMAIL_PUBSUB_TOPIC_NAME',
        },
        label_names: {
            desc: 'Names of the Labels to use when filtering gmail messages.',
            default: ['INBOX', 'to-process'],
            format: 'Array',
            env: 'GMAIL_LABEL_NAMES',
        },
    },
});


const getGoogleConfig = () => config.get('google');
const getParserConfig = () => config.get('parser');

module.exports = {
    getGoogleConfig,
    getParserConfig,
};
