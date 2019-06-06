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
        token_path: {
            desc: 'Path to an Service Credentials',
            default: './token.json',
            format: 'String',
            env: 'GOOGLE_TOKEN_PATH',
        },
    },
    parser: {
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
