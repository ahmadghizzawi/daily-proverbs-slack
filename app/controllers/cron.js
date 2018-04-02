const schedule = require('node-schedule');
const moment = require('moment');

const { getProverb } = require('./proverbs');
const { postMessage } = require('./slack.js');
const Team = require('../models/team');

/**
 *
 *
 * @param item
 * @return
 * {
 *  {
 *    teamId: (*|type),
 *    token: *,
 *    channel: *,
 *    offsetTime:
 *    {
 *      hour: (moment.Moment | number),
 *      minute: (moment.Moment | number)
 *    }
 *  }
 * }
 */
function formatJob(item) {
  const currentTime = moment();
  currentTime.utcOffset(item.schedule.utcOffset.hour);
  currentTime.set({
    hour: item.schedule.time.hour,
    minute: item.schedule.time.minute,
    second: 0,
  });
  currentTime.utcOffset(0);
  return {
    teamId: item.teamId,
    token: item.slackToken,
    channel: item.channelId,
    offsetTime: {
      hour: currentTime.hours(),
      minute: currentTime.minute(),
    },
  };
}

/**
 *
 * @return {Promise.<*>}
 */
async function getList() {
  let list = await Team.find({
    schedule: { $exists: true },
  });
  list = list.map(item => formatJob(item));
  return list;
}

/**
 * scheduleCron - Schedules all crons.
 *
 * @return {Object}  description
 */
async function runCron(item) {
  console.log('runCron', item);
  const j = schedule.scheduleJob(item.teamId, `${item.offsetTime.minute} ${item.offsetTime.hour} * * *`, async () => {
    const proverb = await getProverb();
    await postMessage(item.token, item.channel, proverb);
  });
  console.log(j.nextInvocation());
}

/**
 * scheduleJobs - description
 *
 * @return {type}      description
 */
async function scheduleJobs() {
  const list = await getList();
  list.map(item => runCron(item));
}


/**
 * rescheduleCron - description
 *
 * @param  {type} teamId description
 * @return {type}        description
 */
async function rescheduleCron(teamId) {
  const team = formatJob(await Team.findOne({
    teamId,
  }));

  schedule.scheduledJobs[teamId].reschedule(`${team.offsetTime.minute} ${team.offsetTime.hour} * * *`);
}

/**
 * scheduleCron - description
 *
 * @param  {type} teamId description
 * @return {type}        description
 */
async function scheduleCron(teamId) {
  console.log('scheduleCron', teamId);
  const team = formatJob(await Team.findOne({
    teamId,
  }));

  runCron(team);
}

module.exports = {
  scheduleJobs,
  rescheduleCron,
  scheduleCron,
};
