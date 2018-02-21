const fs = require('fs');
const path = require('path');

const parseFile = require('./parser');

async function parseFiles(files) {
  const rows = files.map(pdf => parseFile(pdf));
  return (await Promise.all(rows))
    .reduce((allRows, subRows) => allRows.concat(subRows), []);
}

const pdfDir = path.join(__dirname, '../pdf');
const pdfFiles = fs.readdirSync(pdfDir)
  .map(pdf => path.join(pdfDir, pdf));

parseFiles(pdfFiles);
