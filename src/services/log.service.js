const chalk = require('chalk/types');

const logInfo = (message) => {
    console.log(`${chalk.blue.bold('[info]')}: ${message}`);
};

const logError = (message) => {
    console.log(chalk.red(`${chalk.bold('[error]')}: ${message}`));
};

module.exports = {
    logInfo,
    logError,
};