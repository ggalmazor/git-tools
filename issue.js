#!/usr/bin/env node

const {listBranches, exec, promptName, promptSelectBranch, Branch} = require('./misc');

const cleanAll = async () => {
  await exec('git checkout master');
  const branches = await listBranches(Branch.isLocal.and(Branch.isIssue));
  branches.forEach(async branch => exec(`git branch -D ${branch.name} &> /dev/null`));
};

const clean = async number => {
  await exec('git checkout master');
  const branches = await listBranches(Branch.isLocal.and(Branch.isIssue(number)));
  branches.forEach(async branch => exec(`git branch -D ${branch.name} &> /dev/null`));
};

const selectBranch = async (localBranches, remoteBranches) => {
  if (localBranches.length === 0 && remoteBranches.length === 1)
    return remoteBranches[0];

  if (localBranches.length === 0 && remoteBranches.length > 1)
    return await promptSelectBranch(remoteBranches);

  if (localBranches.length === 1)
    return localBranches[0];

  if (localBranches.length > 1)
    return await promptSelectBranch(localBranches);
};

const checkout = async number => {
  await exec(`git checkout master`);

  const localBranches = await listBranches(Branch.isLocal.and(Branch.isIssue(number)));
  const remoteBranches = await listBranches(Branch.isRemote.and(Branch.isIssue(number)));
  if (localBranches.length === 0 && remoteBranches.length === 0) {
    const name = await promptName();
    await exec(`git checkout -b issue_${number}_${name}`);
  } else {
    const selectedBranch = await selectBranch(localBranches, remoteBranches);
    await exec(`git checkout ${selectedBranch.name}`);
    if (remoteBranches.some(Branch.isIssue(number)))
      await exec(`git pull`);
  }
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