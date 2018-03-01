const inquirer = require('inquirer');
const Option = require('./option');
const Branch = require('./branch');
const {isEmpty, startsWith} = require('./string');
const {exec} = require('./shell');

const listBranches = async predicate => {
  const {stdout, stderr} = await exec('git branch -a');
  if (stderr) {
    console.error('stderr:', stderr);
    throw new Error("Error trying to get the list of branches")
  }
  return stdout.split("\n")
      .map(s => s.trim())
      .filter(isEmpty.and(startsWith("HEAD ->")).not())
      .map(Branch.from)
      .filter(Option.of(predicate).orElse(__ => true));
};

const promptSelectBranch = branches => inquirer
    .prompt([{
      type: "list",
      name: "selectedBranch",
      message: "Select a remote branch",
      choices: branches.map(b => ({
        name: b.name,
        value: b
      }))
    }])
    .then(({selectedBranch}) => selectedBranch);

const promptBranchName = () => inquirer
    .prompt([{
      type: "input",
      name: "name",
      message: "Provide a name for the new branch"
    }])
    .then(({name}) => name.replace(/ /g, "_"));


module.exports = {listBranches, promptBranchName, promptSelectBranch};