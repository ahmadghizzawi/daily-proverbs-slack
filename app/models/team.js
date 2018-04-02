const mongoose = require('mongoose');

/**
 * Slack Team schema
 */

const TeamSchema = new mongoose.Schema({
  teamId: String,
  slackToken: String,
  channelId: String,
  schedule: Object,
}, {
  timestamps: true,
});

/**
 * Methods
 */

TeamSchema.method({

});

/**
 * Statics
 */
TeamSchema.static({

});

module.exports = mongoose.model('Team', TeamSchema);
