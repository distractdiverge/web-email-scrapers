const R = require('ramda');
const HttpStatus = require('http-status-codes');
const request = require('request-promise-native');
const { logError } = require('gmail-parser.core/services/log.service');
const { writeFileAsync } = require('gmail-parser.core/fs.utils');
const uuid = require('uuid');

const makeRequestOptions = (url) => ({
    method: 'GET',
    encoding: null,
    headers: {
        'Content-Type': 'image/png',
    },
    uri: url,
});

const makeFilename = (getId) => `out_${getId()}.png`;

const getStatusCode = R.path(['response', 'statusCode']);

const handleDownloadError = R.curry((logError, url, err) =>
        getStatusCode(err) === HttpStatus.UNAUTHORIZED
            ? logError(`Could not download ${url}: Permission Denied`)
            : logError(`Could not download ${url}: ${R.propOr('Unknown Error', 'message', err)}`));

const downloadFile = (url) =>
    request(makeRequestOptions(url))
        .then(data => writeFileAsync(makeFilename(uuid.v4), data))
        .catch(handleDownloadError(logError, url));

const downloadFiles = (urls) =>
    urls
        ? Promise.all(R.map(downloadFile, urls))
        : Promise.resolve();

module.exports = {
    makeRequestOptions,
    makeFilename,
    getStatusCode,
    handleDownloadError,
    downloadFile,
    downloadFiles
};