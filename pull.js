#!/usr/bin/env node

const {listBranches, exec, Branch} = require('./misc');

const cleanAll = async () => {
  await exec('git checkout master');
  const branches = await listBranches(Branch.isLocal.and(Branch.isPullRequest));
  branches.forEach(async branch => exec(`git branch -D ${branch.name} &> /dev/null`));
};

const clean = async number => {
  await exec('git checkout master');
  const branches = await listBranches(Branch.isLocal.and(Branch.isPullRequest(number)));
  branches.forEach(async branch => exec(`git branch -D ${branch.name} &> /dev/null`));
};

const checkout = async number => {
  await clean(number);
  await exec(`git fetch origin pull/${number}/head:pr${number}`);
  await exec(`git checkout pr${number}`);
};

const run = async (arg1, arg2) => {
  if (arg1 === 'clean' && arg2 === 'all')
    return cleanAll();
  if (arg1 === 'clean')
    return clean(arg2);
  return checkout(arg1);
};

run(process.argv[2], process.argv[3])
    .catch(e => console.error(e));