const fs = require('fs');
const path = require('path');

const parseFile = require('./parser');


const pdfDir = path.join(__dirname, '../pdf');
const rows = fs.readdirSync(pdfDir)
  .map(pdf => path.join(pdfDir, pdf))
  .reduce((rows, pdf) => rows.concat(parseFile(pdf)), []);

Promise.all(rows).then(s => console.log(s));
