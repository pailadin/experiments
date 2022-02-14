const chalk = require('chalk')
const { getTextFromFile, sendMessageToSlack } = require('./utils/slackUtils')

const slackChannel = process.argv[2]
const filePath = process.argv[3]

if (!slackChannel || !filePath) {
  console.log(chalk.red('Usage: node scripts/release.js <slack-channel> <file-path>'))
  process.exit(1)
}

try {
  const mrkdwn = getTextFromFile(filePath)
  sendMessageToSlack(slackChannel, mrkdwn).catch((error) => {
    console.log(chalk.red(error))
    process.exit(1)
  })
} catch (error) {
  console.log(chalk.red(error))
  process.exit(1)
}
