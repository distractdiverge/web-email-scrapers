const R = require('ramda');
const { Buffer } = require('safe-buffer');

const getMessageData = R.prop('data');
const decodeFromBase64 = input => input
    ? Buffer.from(input, 'base64').toString()
    : undefined;

const subscribe = (event, callback) => {
    const message = R.pipe(getMessageData, decodeFromBase64)(event);
    console.log(`Message: ${message}`);
    callback();
};

module.exports = {
    getMessageData,
    decodeFromBase64,
    subscribe,
};