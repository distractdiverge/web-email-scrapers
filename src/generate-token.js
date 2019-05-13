const { google } = require('googleapis');
const { readFileAsync } = require('./fs.utils');
const { fetchToken } = require('./google.client');
const settings = require('./settings');

const googleConfig = settings.getGoogleConfig();
const CREDENTIALS_PATH = googleConfig.credentials_path;

const main = () =>
    readFileAsync(CREDENTIALS_PATH)
        .then(JSON.parse)
        .then(fetchToken)
        .catch(err => console.log('Error loading client secret file:', err));


if (require.main === module) {
    main()
        .then(() => process.exit())
}