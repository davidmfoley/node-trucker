'use strict';

let expect = require('chai').expect;
var ignoreFilter = require('../lib/ignoreFilter');

describe('ignoreFilter', function() {
  it('handles no ignores', () => {
    var files = ['foo.js', 'bar.js'];
    var result = ignoreFilter([], files);
    expect(result).to.eql(files);
  });

  it('handles double-star', () => {
    var files = ['foo/bar/baz.js', 'bar.js'];
    var result = ignoreFilter(['foo/**/*.js'], files);
    expect(result).to.eql(['bar.js']);
  });

  it('handles glob with no slash', () => {
    var files = ['foo.js', 'baz/foo.js', 'bar.js'];
    var result = ignoreFilter(['foo.js'], files);
    expect(result).to.eql(['bar.js']);
  });

  it('handles negation', () => {
    var files = ['foo/bar/baz.js', 'bar.js'];
    var result = ignoreFilter(['foo/**/*.js'], files);
    expect(result).to.eql(['bar.js']);
  });

  it('handles multiple ignores', () => {
    var ignores = ['foo.js', 'bar.*'];
    var files = ['foo/bar/baz.js', 'bar.js', 'baz/foo.js'];
    var result = ignoreFilter(ignores, files);
    expect(result).to.eql(['bar.js']);
  });
});
