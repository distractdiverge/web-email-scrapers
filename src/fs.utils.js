const fs = require('fs');

const readFileAsync = (path) => new Promise(
	(resolve, reject) =>
		fs.readFile(path, (err, data) =>
			err
				? reject(err)
				: resolve(data)
		)
);

module.exports = {
	readFileAsync,
};
