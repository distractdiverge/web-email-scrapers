const R = require('ramda');
const request = require('request-promise-native');
const { logError } = require('gmail-parser.core/services/log.service');
const { writeFileAsync } = require('gmail-parser.core/fs.utils');
const uuid = require('uuid');

const downloadFiles = (urls) => {
    return urls
        ? Promise.all(R.map(downloadFile, urls))
        : Promise.resolve();
};

const downloadFile = (url) => {
    return request({
        method: 'GET',
        encoding: null,
        headers: {
            'Content-Type': 'image/png',
        },
        uri: url,
    })
        .then(data => writeFileAsync(`out_${uuid.v4()}.png`, data))
        .catch(err => {

            if (R.path(['response', 'statusCode'], err) === 401) {
                logError(`Could not download '${url}'; Permission Denied`);
            } else {
                logError(`Could not download ${url}: ${err.message}`);
            }
        });
};

module.exports = {
    downloadFile,
    downloadFiles
};