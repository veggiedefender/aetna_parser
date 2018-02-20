const bluebird = require('bluebird');
const extract = bluebird.promisify(require('pdf-text-extract'));

function parsePage(page) {
  const lines = page.split('\n');
  console.log(lines);
}

async function parseFile(file) {
  const pages = await extract(file);
  parsePage(pages[0]);
}

module.exports = parseFile;
