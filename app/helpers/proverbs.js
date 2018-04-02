const util = require('util');
const fs = require('fs');

// Convert fs.readFile into Promise version of same
const readFile = util.promisify(fs.readFile);

/**
 * loadProverbs - Retrieves a proverb
 *
 * @return {Array}  Array of proverbs
 * [
 *  {
      quote,
      translation
 *  },
 * ]
 */
async function loadProverbs() {
  // TODO: Load data from DB instead for file.
  // Read the json file that has the proverbs.
  // The will return an array of proverbs.
  return JSON.parse(readFile('data.json', 'utf8'));
}

module.exports = {
  loadProverbs,
};
