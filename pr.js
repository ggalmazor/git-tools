#!/usr/bin/env node

const util = require('util');
const exec = util.promisify(require('child_process').exec);

const run = async (pr) => {
  await exec(`prc ${pr}`);
  await exec(`git fetch origin pull/${pr}/head:pr${pr}`);
  await exec(`git checkout pr${pr}`);
}

run(process.argv[2])
    .catch(e => console.error(e));