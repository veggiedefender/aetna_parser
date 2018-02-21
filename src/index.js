const fs = require('fs');
const path = require('path');

const parseFile = require('./parser');


const pdfDir = path.join(__dirname, '../pdf');
const pdfFiles = fs.readdirSync(pdfDir)
  .map(pdf => path.join(pdfDir, pdf));

pdfFiles.forEach(pdf => parseFile(pdf));
