const { WebClient } = require('@slack/client');
const { getProverb } = require('./proverbs');
const request = require('request-promise');
const Team = require('../models/team');

// An access token (from your Slack app or custom integration - xoxp, xoxb, or xoxa)
// const token = process.env.SLACK_TOKEN;

 /**
  * postMessage - Posts a message into a slack channel
  *
  * @param  {Object} message description
  * @return {Object}         description
  */
async function postMessage(token, channel, message) {
  console.log('postMessage');
  console.log('token', token);
  console.log('message', message);
  console.log('channel', channel);
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

/**
 * deleteMessage - Delete a message from a slack channel
 *
 * @param  {type} channel Channel ID
 * @param  {type} ts      Slack's timestamp
 * @return {type}         description
 */
async function deleteMessage(token, channel, ts) {
 console.log('deleteMessage');
 const web = new WebClient(token);

 // See: https://api.slack.com/methods/chat.postMessage
 return web.chat.delete({ token, channel, ts})
   .then((res) => {
     // `res` contains information about the posted message
     console.log('Message deleted: ', res.ts);
     return res;
   })
   .catch((error) => {
     console.error(error)
     return false;
   });
}

async function authorize(req, res) {
  var options = {
      method: 'POST',
      uri: 'https://slack.com/api/oauth.access',
      form: {
          client_id: process.env.SLACK_CLIENT_ID,
          client_secret: process.env.SLACK_CLIENT_SECRET,
          code: req.query.code
      }
  };

  try {
    const authResponse = JSON.parse(await request(options));

    // Channel Id that app was given permission to post on.
    const channelId = authResponse.incoming_webhook.channel_id;

    // Auth token
    let token = authResponse.access_token;

    // Get the team domain name to redirect to the team URL after auth
    options = {
        method: 'POST',
        uri: 'https://slack.com/api/team.info',
        form: {
            token: token
        }
    };

    const teamBody = JSON.parse(await request(options));
    console.log(teamBody);
    if(teamBody.error == 'missing_scope') {
      res.send('Daily Proverbs has been added to your team!');
    } else {
      // TODO: Move this to team controller.
      let team = teamBody.team.domain;

      // Add team access_token to DB.
      // Setup stuff
      var query = {
        teamId: teamBody.team.id
      },
        update = {
          $set: {
            teamId: teamBody.team.id,
            slackToken: token,
            channelId
          }
        },
        options = { upsert: true, new: true };
      try {
        // Find the document
        const result = await Team.findOneAndUpdate(query, update, options);
        console.log(result);
        res.redirect('http://' +team+ '.slack.com');
      }
      catch (e) {
        res.send(e);
      }

    }
  }
  catch (e) {
    // POST failed...
    // TODO: Make the flow smoother if req fails.
    console.log("Something bad happened.");
    console.log(e);
    res.send('An error has occurred while try to add Daily Proverbs to your team.');
  }

}


module.exports = {
  postMessage,
  deleteMessage,
  authorize,
};
