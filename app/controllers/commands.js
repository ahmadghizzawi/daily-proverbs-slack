const moment = require('moment');
const schedule = require('node-schedule');

const { getProverb } = require('./proverbs');
const Team = require('../models/team');
const { rescheduleCron, scheduleCron } = require('../controllers/cron');

function isValidTime(hour, minute) {
  return !(hour < 0 || hour > 24 || minute < 0 || minute >= 60 || isNaN(minute) || isNaN(hour));
}

function isValidOffset(hour, minute) {
  return !(hour < -12 || hour > 14 || minute < 0 || minute >= 60 || isNaN(minute) || isNaN(hour));
}

/**
 * slashProverb - prepares response to '/proverb' command in Slack.
 *
 * @param  {Object} body request body
 * @return {Object}         response
 */
async function slashProverb(body) {
    const proverb = await getProverb();
    const response = {
      "text" : proverb,
      "response_type": "in_channel",
      "attachments": [
        {
          "callback_id": "make_visible",
          "footer": "Shared by <@" + body.user_id + ">",
        }
      ]
    };

    return response;
}

async function slashDailyProverb(body) {
  try {
    // Get command params
    const commandText = body.text;
    // Command format is /proverb-daily [time] [UTC offset]
    const parameters = commandText.split(" ");

    if (parameters.length > 2 || parameters[0] === '') {
      throw Error('Invalid usage');
    }

    const time = {
      hour: parseInt(parameters[0].split(':')[0]) ,
      minute: parseInt(parameters[0].split(':')[1]) || 0
    };

    const utcOffset = {
      hour: parseInt(parameters[1].split(':')[0]) || 0,
      minute: parseInt(parameters[1].split(':')[1]) || 0
    }; // UTC offset is 0 by default.

    if (!isValidTime(time.hour, time.minute)) {
      throw Error('Wrong time format');
    }

    if (!isValidOffset(utcOffset.hour, utcOffset.minute)) {
      throw Error('Wrong UTC');
    }

    var query = {
      teamId: body.team_id
    },
      update = {
        $set: {
          schedule: {
            time,
            utcOffset
          },
        }
      },
      options = { new: true };

    // set time of daily proverbs.
    const result = await Team.findOneAndUpdate(query, update, options);

    console.log(body);
    if (schedule.scheduledJobs[body.team_id]) {
      await rescheduleCron(body.team_id);
      console.log('Already there');
    }
    else {
      await scheduleCron(body.team_id);
      console.log('Scheduled job');
    }

    //
    let job = schedule.scheduledJobs[body.team_id];
    console.log(job.nextInvocation());
    let jobTime =  job.nextInvocation()._date;
    let jobNext = jobTime.utcOffset(utcOffset.hour).format("dddd, MMMM Do YYYY, HH:mm");;
    return {
      "text": "A daily proverb will be sent here on " + jobNext + ". Enjoy your day!",
    };
  }
  catch (e) {
    console.error(e.toString());
    return {
      "text": "*Help*\n " +
      "To receive a proverb every day, use `/proverb-daily [time] [UTC offset]`. \n\n " +
      "*Here is an example*.\n You live in Beirut, Lebanon and you currently have an offset of +02:00 UTC. If you want to get " +
      "the daily proverbs at 13:00 your time, you will type the following: `/proverb-daily 13:00 +02:00`."
      ,
      "attachments": [
        {
          "footer": "",
        }
      ]
    };
  }
}

module.exports = {
  slashProverb,
  slashDailyProverb
};