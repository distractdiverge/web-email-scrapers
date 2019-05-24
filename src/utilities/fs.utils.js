const fs = require('fs');

const readFileAsync = (path) => new Promise(
	(resolve, reject) =>
		fs.readFile(path, (err, data) =>
			err
				? reject(err)
				: resolve(data)
		)
);

const writeFileAsync = (path, data) => new Promise(
    (resolve, reject) =>
        fs.writeFile(path, data, (err) => err ? reject(err) : resolve(path))
)

module.exports = {
	readFileAsync,
    writeFileAsync,
};
