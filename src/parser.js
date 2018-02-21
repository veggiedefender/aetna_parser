const bluebird = require('bluebird');
const extract = bluebird.promisify(require('pdf-text-extract'));

const states = require('./states');

function extractDates(line) {
  return line.match(/\d+\/\d+\/\d+/g);
}

function extractState(line) {
  return states[line.trim().toLowerCase()];
}

function extractPlanName(line) {
  return line.match(/(?<=Plan Name: ).+/g)[0];
}

function extractGroupRatingAreas(line) {
  return line.match(/(?<=PARA\d)\d/g)[0];
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

function parsePage(page) {
  const lines = page.split('\n');

  const [ startDate, endDate ] = extractDates(lines[0]);
  const state = extractState(lines[2]);
  const planName = extractPlanName(lines[6]);
  const groupRatingAreas = extractGroupRatingAreas(lines[3]);
  const rates = extractRates(lines.slice(9, 9 + 15));
}

async function parseFile(file) {
  const pages = await extract(file);
  pages.forEach(page => parsePage(page));
}

module.exports = parseFile;
