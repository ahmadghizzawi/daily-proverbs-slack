const express = require('express');

const Status = require('../helpers/api-status');
const { respond } = require('../utils/index');

const router = express.Router();

/* User landing. */
router.get('/', (req, res) => {
  respond(res, { data: {}, meta: Status.WELCOME }, Status.WELCOME.status);
});

module.exports = router;
