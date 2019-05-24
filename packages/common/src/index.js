const R = require('ramda');
const { Buffer } = require('safe-buffer');

const subscribe = (event, callback) => {
  const pubsubMessage = R.prop('data', event);

  const message = Buffer.from(pubsubMessage, 'base64').toString();
  console.log(`Message: ${message}`);

  callback();
};

module.exports = {
    subscribe,
};