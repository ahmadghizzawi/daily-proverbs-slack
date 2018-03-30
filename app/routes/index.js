const express = require('express');

const Status = require('../helpers/api-status');
const { respond } = require('../utils/index');
const { postMessage } = require('../controllers/slack.js')

const router = express.Router();

/* API landing. */
router.get('/', async (req, res) => {
  const result = await postMessage();
  console.log(result)
  if (result) {
    return respond(res, { data: result, meta: Status.MESSAGE_SENT }, Status.MESSAGE_SENT.status);
  }
  return respond(res, { data: result, meta: Status.MESSAGE_SENT }, Status.MESSAGE_SENT.status);
});

module.exports = router;
