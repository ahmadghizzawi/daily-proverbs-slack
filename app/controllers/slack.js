const { WebClient } = require('@slack/client');
const { getProverbs } = require('./proverbs');

// An access token (from your Slack app or custom integration - xoxp, xoxb, or xoxa)
const token = process.env.SLACK_TOKEN;

 /**
  * postMessage - Posts a message into a slack channel
  *
  * @param  {Object} message description
  * @return {Object}         description
  */
async function postMessage(message, channel='#general') {
  const web = new WebClient(token);

  // This argument can be a channel ID, a DM ID, a MPDM ID, or a group ID
  const conversationId = channel;

  // See: https://api.slack.com/methods/chat.postMessage
  return web.chat.postMessage({ channel: conversationId, text: message })
    .then((res) => {
      // `res` contains information about the posted message
      console.log('Message sent: ', res.ts);
      return res;
    })
    .catch((error) => {
      console.error(error)
      return false;
    });
}

module.exports = {
  postMessage,
};
