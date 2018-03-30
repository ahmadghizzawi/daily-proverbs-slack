const schedule = require('node-schedule');
const { postMessage } = require('./app/controllers/slack.js')

/**
 * scheduleCrons - Schedules all crons.
 *
 * @return {Object}  description
 */
 // TODO: Read all pending jobs from DB and execute.
async function scheduleCrons() {
  var j = schedule.scheduleJob('5 * * * * *', async function(){
    const result = await postMessage();
    console.log(result)
  });
}

module.exports = {
  scheduleCrons(),
};
