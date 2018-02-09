#!/usr/bin/env node

const {listBranches, exec} = require('./misc');

const run = async (pr) => {
  if (pr === 'all') {
    const branches = await listBranches();
    branches
        .filter(b => b.isLocal())
        .filter(b => b.isPr())
        .forEach(async b => await exec(`git branch -D ${b.name} &> /dev/null`));
  }
  await exec('git checkout master');
  await exec(`git branch -D pr${pr} &> /dev/null`)
};

run(process.argv[2])
    .catch(e => console.error(e));