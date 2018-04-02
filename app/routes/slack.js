const express = require('express');

const Status = require('../helpers/api-status');
const { slashProverb, slashDailyProverb } = require('../controllers/commands');
const { respond } = require('../utils/index');
const { authorize } = require('../controllers/slack');

const router = express.Router();

/* Iniates Slack Oauth process. */
router.get('/', async (req, res) => {
  // Authorize app.
  // TODO: Make this endpoint consistent with the others.
  authorize(req, res);
});

/* Responds to Slack's slash command '/proverb'. */
router.post('/proverb', async (req, res) => {
  // Make sure that the request is coming from Slack.
  if (req.body.token !== process.env.SLACK_VERIFICATION_TOKEN) {
    console.log('Invalid request..');
    return respond(res, Status.FORBIDDEN, Status.FORBIDDEN.status);
  }

  const response = await slashProverb(req.body);

  return respond(res, response, Status.MESSAGE_SENT.status);
});

/* Responds to Slack's slash command '/proverb-daily'. */
router.post('/proverb-daily', async (req, res) => {
  console.log(req.body);
  // Make sure that the request is coming from Slack.
  if (req.body.token !== process.env.SLACK_VERIFICATION_TOKEN) {
    console.log('Invalid request..');
    return respond(res, Status.FORBIDDEN, Status.FORBIDDEN.status);
  }
  try {
    const response = await slashDailyProverb(req.body);
    return respond(res, response, Status.MESSAGE_SENT.status);
  } catch (e) {
    return respond(res, { text: e.toString() });
  }
});

module.exports = router;
