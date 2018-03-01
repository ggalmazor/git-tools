const Option = require('./option');
const {startsWith} = require('./string');

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
    return startsWith(prefix)(this.name);
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
    return startsWith(prefix)(this.name);
  }

  toString() {
    return `${this.name}${this.active ? " <<< ACTIVE" : ""}`;
  }
}

module.exports = Branch;