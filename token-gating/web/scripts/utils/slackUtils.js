const chalk = require('chalk')
const slackifyMarkdown = require('slackify-markdown')
const fetch = require('cross-fetch')
const fs = require('fs')

const getTextFromFile = (filePath) => fs.readFileSync(filePath, 'utf8')

const sendMessageToSlack = async (channel, mrkdwn) => {
  const formattedText = slackifyMarkdown(mrkdwn)
  const payload = JSON.stringify({
    channel,
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: formattedText,
        },
      },
    ],
  })

  fetch('https://alert.highoutput.io/alert', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: payload,
  })
    .then((result) => {
      console.log(chalk.green(`Changelog pushed to slack channel ${channel}`))
    })
    .catch((error) => {
      throw error
    })
}

module.exports = {
  getTextFromFile,
  sendMessageToSlack,
}
