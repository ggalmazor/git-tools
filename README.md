# GitHub review tools

This module provides a `pull` and `issue` command-line commands to help you with your review workflows.

## Installation

- Clone the repo and run `npm link`

or

- Run `npm install -g github-review-tools`

## `pull` command for pull request workflows

When a contributor creates a PR, you can fetch it to your local repo and then check it out to review the pushed commits. Manually, you should do this:
- `git fetch pull/XYZ/head:local_branch` where you fetch the pull request by number into a local branch.
- `git checkout local_branch` where you checkout the branch, loading those commits.

The `pull` command automatizes this with some extra perks:
- checkouts master first, to ensure a common starting place
- cleans a particular PR branch by number
- cleans all PR branches

Usage:
- `pull 33` will fetch and checkout PR #33
- `pull clean 33` will remove the branch for PR #33
- `pull clean all` will remove all found PR branches

## `issue` command for issue workflows

When you want to start working on a particular issue, you normally will fetch and checkout your local master branch and then create a branch from it with some name. Manually, you should do this:
- `git checkout master`
- `git pull`
- `git checkout -b issue_XYZ_some_descriptive_name`

Sometimes you need to switch from one issue branch to another and when issues are complex, you even might need more than one branch per issue. This complicates your workflow as you need to constantly execute `git branch -a` to see what branches you have locally and remotely available.

The `issue` command automatizes this workflow with some extra perks:
- checkouts master first, to ensure a common starting place
- Try to find an already existing local branch for a given issue number
- If more than one local branch matches the issue number, it prompts for a branch selection
- If none is found, try to find an already existing remote branch for a given issue number
- If more than one remote branch matches the issue number, it prompts for a branch selection
- Once a branch is selected, it will pull for changes if a corresponding remote branch is found
- If no local or remote branches are found, it prompts for some description and it creates a new branch for that issue number
- cleans a particular issue branch by number
- cleans all issue branches

Issue branch management case table:

| local match | remote match | What happens? |
| --- | --- | --- |
| none | none | You are prompted for a name and a new branch is created |
| one | irrelevant | The local branch is checked out |
| many | irrelevant | You are prompted to select one of the branches |
| none | one | The remote branch is checked out |
| none | many | You are prompted to select one of the branches |

Usage:
- `issue 33` will try to load a local or remote branch, or it will create a new one if none is found
- `issue clean 33` will remove the branch for issue #33
- `issue clean all` will remove all found issue branches

