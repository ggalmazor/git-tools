#!/usr/bin/env node

const {exec} = require('./misc');

const run = async (pr) => {
  await exec(`prc ${pr}`);
  await exec(`git fetch origin pull/${pr}/head:pr${pr}`);
  await exec(`git checkout pr${pr}`);
};

run(process.argv[2])
    .catch(e => console.error(e));