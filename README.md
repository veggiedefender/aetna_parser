# aetna_parser

[![Build Status](https://travis-ci.org/veggiedefender/aetna_parser.svg?branch=master)](https://travis-ci.org/veggiedefender/aetna_parser)

Parses Aetna Insurance PDF reports

## Installation

```bash
$ yarn add github:veggiedefender/aetna_parser
```

## Usage
This package exposes two functions:

### `parseFile`

Takes a string containing the file path of a PDF, and returns a promise that resolves to an array
that looks like:

```js
[
  '04/01/2017', // start date
  '06/30/2017', // end date
  'PA Gold QPOS 2000 100/50 HSA T', // product name
  'PA', // state
  '1', // group rating area
  '240.82', // age groups:
  '240.82',
  '379.24',
  '379.24',
  '379.24',
  '379.24',
  '380.76',
  '388.34',
  ...
  '1137.34'
]
```

Example:

```js
await parseFile('pdf/para01.pdf');
```

### `parseFiles`

Takes an array of strings containing file paths of PDFs, and returns a promise that resolves
to an array of rows returned from `parseFile`.
