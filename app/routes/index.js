const express = require('express');

const Status = require('../helpers/api-status');
const { respond } = require('../utils/index');
const { postMessage, deleteMessage } = require('../controllers/slack.js')
const { getProverb } = require('../controllers/proverbs.js')

const router = express.Router();

/* Test the API. */
router.get('/test', async (req, res) => {
  const proverb = await getProverb();
  const result = await postMessage(proverb);
  if (result) {
    return respond(res, { data: result, meta: Status.MESSAGE_SENT }, Status.MESSAGE_SENT.status);
  }
  return respond(res, { data: result, meta: Status.MESSAGE_SENT }, Status.MESSAGE_SENT.status);
});

module.exports = router;
