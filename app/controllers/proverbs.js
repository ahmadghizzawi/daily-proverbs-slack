const { loadProverbs } = require('../helpers/proverbs');
/**
 * formatProverb - Formats a proverb object into a string.
 *
 * @param  {Object} proverb proverb object
 * @return {string}         proverb
 */
function formatProverb(proverb) {
  return `*${proverb.language} Proverb*\n\`\`\`${proverb.quote
  } \n\nTranslation/Interpretation: \n${proverb.translation}\`\`\``;
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
    const data = await loadProverbs();

    // Get a random proverb from the array.
    const proverb = data[Math.floor(Math.random() * data.length)];

    // TODO: make this dynamic
    proverb.language = 'Arabic';

    return formatProverb(proverb);
  } catch (err) {
    console.log(err);
    return false;
  }
}

module.exports = {
  getProverb,
};
