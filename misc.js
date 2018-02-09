const inquirer = require('inquirer');
const util = require('util');
const exec = command => {
  console.log(command);
  return util.promisify(require('child_process').exec)(command);
};

class Branch {
  constructor(name, active, remote) {
    this.name = name;
    this.active = active;
    this.remote = remote;
  }

  static from(line) {
    if (line.startsWith("*"))
      return new Branch(line.substring(2), true, null);
    else if (line.startsWith("remotes\/")) {
      const [__, remote, name] = line.split("\/");
      return new Branch(name, false, remote);
    } else
      return new Branch(line, false, null);
  }

  isIssue(issue) {
    return this.name.indexOf(`issue_${issue}_`) !== -1;
  }

  isLocal() {
    return this.remote === null;
  }

  isPr() {
    return this.name.startsWith('pr')
  }

  toString() {
    return `${this.name}${this.active ? " <<< ACTIVE" : ""}`;
  }
}

const listBranches = async () => {
  const {stdout, stderr} = await exec('git branch -a');
  if (stderr) {
    console.error('stderr:', stderr);
    throw new Error("Error trying to get the list of branches")
  }
  return stdout.split("\n")
      .map(s => s.trim())
      .filter(s => s.length > 0)
      .map(Branch.from);
};

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


module.exports = {listBranches, exec, promptName, promptSelectBranch};