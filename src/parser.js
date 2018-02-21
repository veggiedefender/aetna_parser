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

function parsePage(page) {
  const lines = page.split('\n');

  const [ startDate, endDate ] = extractDates(lines[0]);
  const state = extractState(lines[2]);
  const planName = extractPlanName(lines[6]);
  const groupRatingAreas = extractGroupRatingAreas(lines[3]);
}

async function parseFile(file) {
  const pages = await extract(file);
  pages.forEach(page => parsePage(page));
}

module.exports = parseFile;
