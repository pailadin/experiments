const fs = require('fs')
const chalk = require('chalk')
const path = require('path')
const _groupBy = require('lodash').groupBy
const { issueTypes } = require('./commitizen')

const CHANGELOG_DIRECTORY = path.join(__dirname, '..')
const department = process.argv[2] // web | api | android | ios | infra
const jiraDomain = process.argv[3] // 'https://identifi.atlassian.net'

if (!department || !jiraDomain) {
  console.log(chalk.red('Usage: node scripts/changelog.js <department> <jira-domain>'))
  process.exit(1)
}

const DEPARTMENT_CONFIG = {
  tagPrefix: department,
  commitRegex: new RegExp(`^${department}\/[A-Z]+-[0-9]+`, 'gm'),
  jiraTicketRegex: /[A-Z]+-[0-9]+/,
  issueTypeRegex: /:[a-z]+:/,
}

const trimMultipleSpaces = (string) => string.trim().replace(/\s\s+/g, ' ')
const generateChangelogFile = (markdownContent) => {
  const filePath = path.join(CHANGELOG_DIRECTORY, 'CHANGELOG.md')
  fs.writeFileSync(filePath, markdownContent)
}

require('child_process').execSync('git fetch --tags')
const recentTwoTags = require('child_process')
  .execSync(`git tag --sort=-v:refname -n ${DEPARTMENT_CONFIG.tagPrefix}/v* | head -n 2`)
  .toString()
  .trim()
  .split('\n')
  .filter((x) => !!x)

if (recentTwoTags.length) {
  const [currentTag, lastTag] = recentTwoTags.map((tag) => trimMultipleSpaces(tag).split(' ')[0])
  const gitCommand = lastTag
    ? `git log --oneline --pretty=format:"%s" ${lastTag}..@`
    : 'git log --oneline --pretty=format:"%s"'
  const commits = require('child_process').execSync(gitCommand).toString().trim()
  const filteredCommits = commits.split('\n').filter((c) => c.match(DEPARTMENT_CONFIG.commitRegex))
  const formattedCommits = filteredCommits.map((c) => {
    const [commitScope, commitMessage] = c.split(' : ')
    const ticketId = commitScope.match(DEPARTMENT_CONFIG.jiraTicketRegex)?.toString().toUpperCase()
    const issueType = commitMessage.match(DEPARTMENT_CONFIG.issueTypeRegex)?.toString()
    const fallbackType = issueTypes.find((it) => it.default)
    return {
      issueType: issueType || fallbackType.value,
      commit: `[${commitScope}](${jiraDomain}/browse/${ticketId}): ${commitMessage}`,
    }
  })
  const groupedCommits = _groupBy(formattedCommits, (c) => c.issueType)
  const changelogs = Object.keys(groupedCommits).map((issueType) => {
    const changelogType = issueTypes.find((it) => it.value === issueType)
    const title = `### ${changelogType?.name.split('\t').slice(-1)}`
    const commits = groupedCommits[issueType].map((c) => c.commit).join('\n')
    return `${title}\n${commits}`
  })
  changelogs.unshift(`## Identifi Changelog - ${currentTag}`)

  generateChangelogFile(changelogs.join('\n\n'))
}
