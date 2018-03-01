const util = require('util');

const exec = command => {
  console.log(command);
  return util.promisify(require('child_process').exec)(command);
};

module.exports = {exec};