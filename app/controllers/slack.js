const { WebClient } = require('@slack/client');
const request = require('request-promise');
const Team = require('../models/team');

/**
  * postMessage - Posts a message into a slack channel
  *
  * @param token
  * @param channel
  * @param  {Object} message description
  * @return {Object}         description
  */
async function postMessage(token, channel, message) {
  const web = new WebClient(token);

  // This argument can be a channel ID, a DM ID, a MPDM ID, or a group ID
  // See: https://api.slack.com/methods/chat.postMessage
  return web.chat.postMessage({ channel, text: message })
    .then((res) => {
      // `res` contains information about the posted message
      console.log('Message sent: ', res.ts);
      return res;
    })
    .catch((error) => {
      console.error(error);
      return false;
    });
}

/**
 * deleteMessage - Delete a message from a slack channel
 *
 * @param token
 * @param  {type} channel Channel ID
 * @param  {type} ts      Slack's timestamp
 * @return {type}         description
 */
async function deleteMessage(token, channel, ts) {
  console.log('deleteMessage');
  const web = new WebClient(token);

  // See: https://api.slack.com/methods/chat.postMessage
  return web.chat.delete({ token, channel, ts })
    .then((res) => {
      // `res` contains information about the posted message
      console.log('Message deleted: ', res.ts);
      return res;
    })
    .catch((error) => {
      console.error(error);
      return false;
    });
}

/**
 *
 * @param req
 * @param res
 * @return {Promise.<void>}
 */
async function authorize(req, res) {
  try {
    let options = {
      method: 'POST',
      uri: 'https://slack.com/api/oauth.access',
      form: {
        client_id: process.env.SLACK_CLIENT_ID,
        client_secret: process.env.SLACK_CLIENT_SECRET,
        code: req.query.code,
      },
    };

    const authResponse = JSON.parse(await request(options));

    console.log('authResponse', authResponse);

    // Channel Id that app was given permission to post on.
    const channelId = authResponse.incoming_webhook.channel_id;

    // Auth token
    const token = authResponse.access_token;

    // Get the team domain name to redirect to the team URL after auth
    options = {
      method: 'POST',
      uri: 'https://slack.com/api/team.info',
      form: {
        token,
      },
    };

    const teamBody = JSON.parse(await request(options));
    console.log('teamBody', teamBody);
    if (teamBody.error === 'missing_scope') {
      res.send('Daily Proverbs has been added to your team!');
    } else {
      // TODO: Move this to team controller.
      const team = teamBody.team.domain;

      // Add team access_token to DB.
      // Setup stuff
      const query = {
        teamId: teamBody.team.id,
      };
      const update = {
        $set: {
          teamId: teamBody.team.id,
          slackToken: token,
          channelId,
        },
      };
      console.log('update', update);
      options = { upsert: true, new: true };
      try {
        console.log('before query');
        // Find the document
        const result = await Team.findOneAndUpdate(query, update, options);
        console.log(result);
        console.log('after query');
        res.redirect(`http://${team}.slack.com`);
      } catch (e) {
        res.send(e);
      }
    }
  } catch (e) {
    // POST failed...
    // TODO: Make the flow smoother if req fails.
    console.log('Something bad happened.');
    console.log(e);
    res.send('An error has occurred while try to add Daily Proverbs to your team.');
  }
}


module.exports = {
  postMessage,
  deleteMessage,
  authorize,
};
