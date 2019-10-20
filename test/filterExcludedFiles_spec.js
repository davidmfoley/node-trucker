'use strict';

let expect = require('chai').expect;
var filterExcludedFiles = require('../lib/filterExcludedFiles');

describe('filterExcludedFiles', function() {
  it('handles double-star', () => {
    var files = testFiles(['foo/bar/baz.js', 'bar.js']);
    var result = filterExcludedFiles('/src', ['foo/**/*.js'], files);
    expect(result.length).to.eql(1);
    expect(result[0].fullPath).to.eql('/src/bar.js');
  });

  it('handles glob with no slash', () => {
    var files = testFiles(['foo.js', 'baz/foo.js', 'bar.js']);
    var result = filterExcludedFiles('/src', ['foo.js'], files);
    expect(result.length).to.eql(1);
    expect(result[0].fullPath).to.eql('/src/bar.js');
  });

  it('handles directory match of two levels', () => {
    var files = testFiles(['foo/bar/baz.js', 'bar.js']);
    var result = filterExcludedFiles('/src', ['foo/bar'], files);
    expect(result.length).to.eql(1);
    expect(result[0].fullPath).to.eql('/src/bar.js');
  });

  it('handles negation', () => {
    var files = testFiles(['foo/bar/baz.js', 'bar.js']);
    var result = filterExcludedFiles('/src', ['foo/**/*.js'], files);
    expect(result.length).to.eql(1);
    expect(result[0].fullPath).to.eql('/src/bar.js');
  });

  it('handles multiple ignores', () => {
    var ignores = ['foo.js', 'bar.*'];
    var files = testFiles(['foo/bar/baz.js', 'bar.js', 'baz/foo.js']);
    var result = filterExcludedFiles('/src', ignores, files);
    expect(result.length).to.eql(1);
    expect(result[0].fullPath).to.eql('/src/foo/bar/baz.js');
  });
});

function testFiles(names) {
  return names.map(name => ({fullPath: '/src/' + name}) );
}
