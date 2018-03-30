var fs = require('fs');
const util = require('util');

// Convert fs.readFile into Promise version of same
const readFile = util.promisify(fs.readFile);

/**
 * formatProverb - Formats a proverb object into a string.
 *
 * @param  {Object} proverb proverb object
 * @return {string}         proverb
 */
function formatProverb(proverb) {
  return proverb.quote + " \nTranslation/Interpretation: " + proverb.translation;
}

/**
 * getProverb - Retrieves a proverb
 *
 * @return {string}  Proverb
 */
async function getProverb() {
  try {
    // Read the json file that has the proverbs.
    // The will return an array of proverbs.
    data = await readFile('data.json', 'utf8');

    // Get a random proverb from the array.
    const proverb =  data[Math.floor(Math.random() * data.length)];

    return  formatProverb(proverb);
  }
  catch (err) {
    return false;
    console.log(err);
  }
}

module.exports = {
  getProverbs,
};
