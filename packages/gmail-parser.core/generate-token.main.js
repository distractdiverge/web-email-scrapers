const R = require('ramda');
const { readFileAsync } = require('./fs.utils');
const { getNewToken } = require('./services/google.client');
const settings = require('./settings');

const getCredentialsPath = R.prop('credentials_path');
const getTokenPath = R.prop('token_path');

const main = (config) =>
    readFileAsync(getCredentialsPath(config))
        .then(JSON.parse)
        .then(getNewToken(getTokenPath(config)))
        .catch(err => console.log('Error loading client secret file:', err));


if (require.main === module) {
    const config = settings.getGoogleConfig();
    main(config)
        .then(() => process.exit())
        .catch(err => {
            console.error(err);
            process.exit(1);
        });
}

module.exports = {
  getCredentialsPath,
  getTokenPath,
  main,
};