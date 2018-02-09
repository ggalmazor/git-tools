#!/usr/bin/env node
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const inquirer = require('inquirer');
const {Branch, listBranches} = require('./branch');

const promptSelectBranch = branches => inquirer
    .prompt([{
      type: "list",
      name: "selectedBranch",
      message: "Select a remote branch",
      choices: branches.map(b => b.name)
    }])
    .then(({selectedBranch}) => selectedBranch);

const promptName = () => inquirer
    .prompt([{
      type: "input",
      name: "name",
      message: "Provide a name for the new branch"
    }])
    .then(({name}) => name.replace(/ /g, "_"));

const run = async (issue) => {
  const branches = await listBranches();
  const localBranches = branches.filter(b => b.isIssue(issue)).filter(b => b.isLocal())
  const remoteBranches = branches.filter(b => b.isIssue(issue)).filter(b => !b.isLocal())

  if (localBranches.length === 0 && remoteBranches.length === 0) {
    await exec(`git checkout master`);
    const name = await promptName();
    await exec(`git checkout -b issue_${issue}_${name}`);
  }

  if (localBranches.length === 0 && remoteBranches.length === 1) {
    await exec(`git checkout master`);
    await exec(`git checkout ${remoteBranches[0].name}`);
    await exec(`git pull`);
  }

  if (localBranches.length === 0 && remoteBranches.length > 1) {
    await exec(`git checkout master`);
    promptSelectBranch(remoteBranches, async branch => await exec(`git checkout ${branch}`));
    await exec(`git pull`);
  }

  if (localBranches.length === 1) {
    await exec(`git checkout master`);
    await exec(`git checkout ${localBranches[0].name}`);
    if (remoteBranches.some(b => b.name === localBranches[0].name))
      await exec(`git pull`);
  }

  if (localBranches.length > 1) {
    await exec(`git checkout master`);
    const selectedBranch = await promptSelectBranch(localBranches);
    await exec(`git checkout ${selectedBranch}`);
    if (remoteBranches.some(b => b.name === localBranches[0].name))
      await exec(`git pull`);
  }
}

run(process.argv[2], process.argv.slice(3).join("_"))
    .catch(e => console.error(e));