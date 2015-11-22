'use strict';

let expect = require('chai').expect;
let readIgnores = require('../lib/readIgnores');

describe('readIgnores', function() {
  it('works here', function() {
    // read the trucker .gitignore
    var ignores = readIgnores(__dirname);
    expect(ignores).to.eql([
      'node_modules',
      'tmp',
      'coverage',
    ]);
  });

});
