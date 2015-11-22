'use strict';

let path = require('path');
let expect = require('chai').expect;
let readIgnores = require('../lib/readIgnores');

describe('readIgnores', function() {
  it('works here', function() {
    // read the trucker .gitignore
    var ignore = readIgnores(__dirname);
    expect(ignore.patterns).to.eql([
      'node_modules',
      'tmp',
      'coverage',
    ]);

    expect(ignore.base).to.equal(path.normalize(__dirname + '/..'));
  });

});
