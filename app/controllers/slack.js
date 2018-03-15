const { WebClient } = require('@slack/client');

// An access token (from your Slack app or custom integration - xoxp, xoxb, or xoxa)
const token = process.env.SLACK_TOKEN;

const web = new WebClient(token);

// This argument can be a channel ID, a DM ID, a MPDM ID, or a group ID
const conversationId = 'C1232456';

// See: https://api.slack.com/methods/chat.postMessage
web.chat.postMessage({ channel: conversationId, text: 'Hello there' })
  .then((res) => {
    // `res` contains information about the posted message
    console.log('Message sent: ', res.ts);
  })
  .catch(console.error);
