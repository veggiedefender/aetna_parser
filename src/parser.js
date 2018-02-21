const assert = require('assert');
const bluebird = require('bluebird');
const extract = bluebird.promisify(require('pdf-text-extract'));

const states = require('./states');

function extractDates(lines) {
  return lines[0].match(/\d+\/\d+\/\d+/g);
}

function extractPlanName(lines) {
  return lines[6].match(/(?<=Plan Name: ).+/g)[0];
}

function extractState(lines) {
  return states[lines[2].trim().toLowerCase()];
}

function extractGroupRatingAreas(lines) {
  return lines[3].match(/(?<=PARA\d)\d/g)[0];
}

function extractRates(lines) {
  return lines
    .map(line => line.trim().split(/\s+/))
    .reduce((buckets, line) => {
      for (let i = 0; i < line.length; i += 2) {
        buckets[line[i]] = line[i + 1];
      }
      return buckets;
    }, {});
}

function transformRates(rates) {
  const row = [];
  row.push(rates['0-20'], rates['0-20']); // zero_eighteen and nineteen_twenty are subsets of 0-20
  for (let i = 21; i <= 63; i += 1) {
    row.push(rates[i.toString()]);
  }
  row.push(rates['64+'], rates['64+']); // sixty_four and sixty_five_plus are subsets of 64+
  assert(row.length === 47); // sanity check: we need 47 buckets
  return row;
}

function parsePage(page) {
  const lines = page.split('\n');

  const [startDate, endDate] = extractDates(lines);
  const planName = extractPlanName(lines);
  const state = extractState(lines);
  const groupRatingAreas = extractGroupRatingAreas(lines);

  const rates = extractRates(lines.slice(9, 9 + 15));
  const row = transformRates(rates);

  return [startDate, endDate, planName, state, groupRatingAreas, ...row];
}

async function parseFile(file) {
  const pages = await extract(file);
  return pages.map(page => parsePage(page));
}

module.exports = parseFile;
