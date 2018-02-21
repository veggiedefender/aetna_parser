const parseFile = require('./parser');

async function parseFiles(files) {
  const rows = files.map(pdf => parseFile(pdf));
  return (await Promise.all(rows))
    .reduce((allRows, subRows) => allRows.concat(subRows), []);
}

module.exports = { parseFile, parseFiles };
