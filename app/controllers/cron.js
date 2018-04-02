const schedule = require('node-schedule');
const moment = require('moment');

const { getProverb } = require('./proverbs');
const { postMessage } = require('./slack.js');
const Team = require('../models/team');

function formatJob(item) {
  let currentTime = moment();
  currentTime.utcOffset(item.schedule.utcOffset.hour);
  currentTime.set({
         'hour' : item.schedule.time.hour,
         'minute' : item.schedule.time.minute,
         'second' : 0
      });
  currentTime.utcOffset(0);
  return {
    teamId: item.teamId,
    token: item.slackToken,
    channel: item.channelId,
    offsetedTime: {
      hour: currentTime.hours(),
      minute: currentTime.minute()
    },
  };
}

// TODO: Read all pending jobs from DB and execute.
async function getList() {
  var list = await Team.find({
    schedule: { $exists: true }
  });
  list = list.map(item => {
    return formatJob(item);
  })
  return list;
}

/**
 * scheduleCron - Schedules all crons.
 *
 * @return {Object}  description
 */
async function runCron(item) {
  console.log('runCron', item);
  var j = schedule.scheduleJob(item.teamId, item.offsetedTime.minute + " " +  item.offsetedTime.hour + " * * *", async function() {
    const proverb = await getProverb();
    const result = await postMessage(item.token, item.channel, proverb);
  });
  console.log(j.nextInvocation());
}

/**
 * scheduleCrons - description
 *
 * @param  {type} list
 * {
 *   teamId,
 *   token,
 *   channel,
 *   offsetedTime: {
 *     hour,
 *     minute
 *   }
 * }
 * @return {type}      description
 */
async function scheduleCrons() {
 var list = await getList();
 list.map(item => {
   runCron(item);
 });
}


/**
 * rescheduleCron - description
 *
 * @param  {type} teamId description
 * @return {type}        description
 */
async function rescheduleCron(teamId) {
  let team = formatJob(await Team.findOne({
    teamId: teamId
  }));

  schedule.scheduledJobs[teamId].reschedule(team.offsetedTime.minute + " " +  team.offsetedTime.hour + " * * *");
}

/**
 * scheduleCron - description
 *
 * @param  {type} teamId description
 * @return {type}        description
 */
async function scheduleCron(teamId) {
  console.log('scheduleCron', teamId);
  let team = formatJob(await Team.findOne({
    teamId: teamId
  }));

  runCron(team);
}

module.exports = {
  scheduleCrons,
  rescheduleCron,
  scheduleCron
};
