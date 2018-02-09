# Quick & dirty Git tools

## prc
- Remove local branch for PR #42: `prc 42`
- Remove all local PR branches: `prc all` (all branches starting with 'pr')

## pr
- Fetch and checkout PR #42: `pr 42` (creates a local branch 'pr42')

## issue

This script switches to an issue branch. Issue branches follow the format 'issue_X_some_name'.

Example usage: `issue 42`

| local match | remote match | What happens? |
| --- | --- | --- |
| none | none | You are prompted for a name and a new branch is created |
| one | irrelevant | The local branch is checked out |
| many | irrelevant | You are prompted to select one of the branches |
| none | one | The remote branch is checked out |
| none | many | You are prompted to select one of the branches |

Every time a branch is checked out, we try to pull it if a remote branch exists