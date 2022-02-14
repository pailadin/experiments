//  https://github.com/commitizen/cz-jira-smart-commit
//  https://github.com/ngryman/cz-emoji

const inquirer = require('inquirer')

const issueTypes = [
  {
    name: 'feature \t✨  New feature',
    value: ':sparkles:',
  },
  {
    name: 'fix \t\t🐛  Bug fix',
    value: ':bug:',
  },
  {
    name: 'docs \t\t📝  Documentation change',
    value: ':memo:',
  },
  {
    name: 'refactor \t🔨  Code refactoring',
    value: ':hammer:',
  },
  {
    name: 'misc \t\t⚡️  Other changes',
    value: ':zap:',
    default: true,
  },
  {
    name: 'revert \t⏪️  Revert changes',
    value: ':rewind:',
  },
]

const gitBranch = require('child_process').execSync('git rev-parse --abbrev-ref HEAD').toString().trim().split('-')
const ticketName = gitBranch ? `${gitBranch[0]}-${gitBranch[1]}` : undefined

const formatCommit = (commit, answers) => {
  const issues = answers.issues.trim()
  commit(
    [
      issues.length === 0 ? undefined : `${issues} :`,
      answers.type,
      answers.message,
      '\n\n',
      issues.length && (answers.workflow || answers.time || answers.comment) ? `${issues} : ` : undefined,
      answers.workflow ? `#${answers.workflow}` : undefined,
      answers.time ? `#time ${answers.time}` : undefined,
      answers.comment ? `#comment ${answers.comment}` : undefined,
    ]
      .filter((x) => !!x)
      .join(' ')
  )
}

const prompter = (_, commit) => {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'type',
        message: "Select the type of change you're committing:",
        choices: issueTypes,
      },
      {
        type: 'input',
        name: 'message',
        message: 'GitHub commit message (required):\n',
        validate(input) {
          if (!input) {
            return 'empty commit message'
          }
          return true
        },
      },
      {
        type: 'input',
        name: 'issues',
        message: 'Jira Issue ID(s) (required):\n',
        default: ticketName,
        validate(input) {
          if (!input) {
            return 'Must specify issue IDs, otherwise, just use a normal commit message'
          }
          return true
        },
      },
      {
        type: 'list',
        name: 'workflow',
        message: 'Workflow transition:\n',
        choices: [
          {
            name: 'No transition',
            value: '',
          },
          {
            name: 'Peer Review',
            value: 'peer-review',
          },
          {
            name: 'Back To Backlog',
            value: 'back-to-backlog',
          },
          {
            name: 'Back To Development',
            value: 'back-to-development',
          },
          {
            name: 'Close Issue (No QA Needed)',
            value: 'close-issue',
          },
        ],
        when(answers) {
          return !!answers.issues.trim()
        },
      },
      {
        type: 'input',
        name: 'time',
        message: 'Time spent (i.e. 3h 15m) (optional):\n',
      },
      {
        type: 'input',
        name: 'comment',
        message: 'Jira comment (optional):\n',
        when(answers) {
          return !!answers.issues.trim()
        },
      },
    ])
    .then((answers) => formatCommit(commit, answers))
}

module.exports = { prompter, issueTypes }
