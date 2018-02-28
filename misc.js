const inquirer = require('inquirer');
const util = require('util');
const exec = command => {
  console.log(command);
  return util.promisify(require('child_process').exec)(command);
};

Function.prototype.and = function (other) {
  const self = this;
  return function (...args) {
    return self.apply(this, args) && other.apply(other, args);
  }
};

class Option {
  static of(value) {
    if (value === null || value === undefined)
      return NONE;
    if (value instanceof Option)
      return value;
    return new Some(value);
  }

  static none() {
    return NONE;
  }
}

class None extends Option {
  orElse(defaultValue) {
    return defaultValue;
  }

  map(mapper) {
    return this;
  }

  isPresent() {
    return false;
  }

  isEmpty() {
    return true;
  }
}

const NONE = new None();

class Some extends Option {
  constructor(value) {
    super();
    this.value = value;
  }

  orElse(defaultValue) {
    return this.value;
  }

  map(mapper) {
    return Option.of(mapper(this.value));
  }

  isPresent() {
    return true;
  }

  isEmpty() {
    return false;
  }
}

class Branch {
  constructor(name, active, remote) {
    this.name = name;
    this.active = active;
    this.remote = Option.of(remote);
  }

  static remote(name, remote) {
    return new Branch(name, false, remote);
  }

  static local(name) {
    return new Branch(name, false);
  }

  static active(name) {
    return new Branch(name, true);
  }

  static from(line) {
    if (line.startsWith("*"))
      return Branch.active(line.substring(2));

    if (line.startsWith("remotes\/")) {
      const [__, remote, name] = line.split("\/");
      return Branch.remote(name, remote);
    }

    return Branch.local(line);
  }

  static isLocal(branch) {
    return branch.isLocal();
  }

  static isRemote(branch) {
    return branch.isRemote();
  }

  static isIssue(arg) {
    return arg instanceof Branch
        ? arg.isIssue()
        : branch => branch.isIssue(arg);
  }

  static isPullRequest(arg) {
    return arg instanceof Branch
        ? arg.isPullRequest()
        : branch => branch.isPullRequest(arg);
  }

  isIssue(number) {
    const prefix = Option.of(number)
        .map(n => `issue_${n}_`)
        .orElse('issue_');
    return this.name.indexOf(prefix) === 0;
  }

  isLocal() {
    return this.remote.isEmpty();
  }

  isRemote() {
    return this.remote.isPresent();
  }

  isPullRequest(number) {
    const prefix = Option.of(number)
        .map(n => `pr_${n}`)
        .orElse('pr_');
    return this.name.indexOf(prefix) === 0;
  }

  toString() {
    return `${this.name}${this.active ? " <<< ACTIVE" : ""}`;
  }
}

const listBranches = async predicate => {
  const {stdout, stderr} = await exec('git branch -a');
  if (stderr) {
    console.error('stderr:', stderr);
    throw new Error("Error trying to get the list of branches")
  }
  return stdout.split("\n")
      .map(s => s.trim())
      .filter(s => s.length > 0)
      .filter(s => s.indexOf("HEAD ->") === -1)
      .map(Branch.from)
      .filter(Option.of(predicate).orElse(i => true));
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

const promptName = () => inquirer
    .prompt([{
      type: "input",
      name: "name",
      message: "Provide a name for the new branch"
    }])
    .then(({name}) => name.replace(/ /g, "_"));


module.exports = {listBranches, exec, promptName, promptSelectBranch, Branch};