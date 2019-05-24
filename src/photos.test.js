const R = require('ramda');
const { authWithCredentialsFile } = require('./services/google.client');
const photosService = require('./services/gphotos.service');
const settings = require('./utilities/settings');

const googleConfig = settings.getGoogleConfig();
const CREDENTIALS_PATH = googleConfig.credentials_path;

const main = () => {
    return authWithCredentialsFile(CREDENTIALS_PATH)
        .then(auth => photosService.listAlbums(R.path(['credentials', 'access_token'], auth)))
        .then(albums => {
            R.forEach((album) => console.log(album), albums);
        });
};


if (require.main === module) {
    main()
        .then(() => process.exit(0))
        .catch(() => process.exit(1));
}

module.exports = {
    main,
};