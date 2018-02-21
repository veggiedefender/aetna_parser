/* global describe it before */
/* eslint-disable no-underscore-dangle */

const fs = require('fs');
const path = require('path');
const assert = require('assert');
const rewire = require('rewire');

const parser = rewire('../src/parser');

describe('extractor functions', () => {
  let pages;
  before(async () => {
    const pdfDir = path.join(__dirname, 'pdf');
    const pdfFiles = await Promise.all(fs.readdirSync(pdfDir)
      .map(pdf => parser.__get__('extract')(path.join(pdfDir, pdf))));
    pages = [].concat(...[].concat(...pdfFiles))
      .map(page => page.split('\n'));
  });

  function testExtractors(extractor, tester) {
    return () => {
      pages.forEach((lines) => {
        tester(parser.__get__(extractor)(lines));
      });
    };
  }

  it('should extract valid dates', testExtractors('extractDates', (dates) => {
    assert(dates.length === 2);
    dates.forEach(date => assert(/\d+\/\d+\/\d+/.test(date)));
  }));

  it('should extract a plan name', testExtractors('extractPlanName', (planName) => {
    assert(planName.length !== 0);
  }));

  it('should extract a 2 letter state abbreviation', testExtractors('extractState', (state) => {
    assert(state.length === 2);
    assert(state.toUpperCase() === state);
  }));

  it('should extract a numeric group rating area', testExtractors('extractGroupRatingAreas', (area) => {
    assert(!Number.isNaN(area));
  }));

  it('should extract insurance rates by age group', testExtractors('extractRates', (rates) => {
    assert(Object.keys(rates).length === 45);
    Object.keys(rates).forEach((bucket) => {
      assert(!Number.isNaN(rates[bucket]));
    });
    const row = parser.__get__('transformRates')(rates);
    assert(row.length === 47);
  }));
});
