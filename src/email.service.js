const urlLib = require('url');
const R = require('ramda');
const cheerio = require('cheerio');
const { simpleParser } = require('mailparser');

const parseEmailHtml = (email) => {
    // TODO: Find a way to get a text-only summary of the email

    // TODO: Extract HTML from Message
    // TODO: Parse HTML via Cherio
    const $ = cheerio.load(email.text);

    // TODO: Extract Img Links from HTML
    const imgs = $('img');

    // TODO: Create list of links to change (to download links)
    const imgLinks = imgs
        .map((_, el) => $(el).attr('src'))
        .toArray()
        // TODO: Introduce Ramda for util functions
        .map(url => url ? url.toLowerCase() : url);

    // Only get links that look like this: 'https://www.tadpoles.com/m/p/TKniTaKPmsp5ynEuKsSjbM?thumbnail=true&d=t&s=t'
    const validFormat = /https\:\/\/www\.tadpoles\.com\/m\/p\/\w+\?thumbnail=true&d=t&s=t.*/;
    const filteredLinks = imgLinks
        .filter(url => validFormat.test(url));

    return Promise.resolve(filteredLinks);
};

const modifyLinks = (urls) => {
    const result = urls
        .map(urlLib.parse)
        .map(R.omit(['search', 'query']))

        // TODO: Return Download Links
        .map(R.mergeLeft({ search: '?d=t&download=t'}))
        .map(urlLib.format);

    return Promise.resolve(result);
}

const parseMimeEmail = (mimeEmailData) => {
    const encodedData = (new Buffer(mimeEmailData, 'base64')).toString('ascii');
    const data = decodeURIComponent(escape(encodedData));

    return simpleParser(data);
};

const parseEmail = (email) => {
    if (email.size === 0) {
        return Promise.resolve(undefined);
    }
    return parseMimeEmail(email.data)
        .then(parseEmailHtml)
        .then(modifyLinks)
        .catch(err => console.error(err));
};

module.exports = {
    parseMimeEmail,
    parseEmailHtml,
    parseEmail,
};