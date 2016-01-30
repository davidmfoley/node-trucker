'use strict';

let expect = require('chai').expect;

let applyToFile = require('../lib/handleFileChanges/applyToFile');

let contents;
let written;

let fs = {
  readLines: function() {
    return [''].concat(contents.split('\n'));
  },
  writeLines: function(_, data) {
    written = data.slice(1).join('\n');
  }
};

describe('applyToFile', function() {
  it('works with a single require', function() {
    var exampleEdits;
    contents = "\nvar foo = require('./bar');\n";
    exampleEdits = [
      {
        loc: {
          line: 2,
          start: 20,
          length: 5
        },
        newPath: './bar/baz42'
      }
    ];
    applyToFile('foo.js', exampleEdits, fs);
    expect(written).to.equal("\nvar foo = require('./bar/baz42');\n");
  });
  it('works with multiple requires on a line', function() {
    var exampleEdits;
    contents = "\nvar foo = require('./foo'), bar = require('./bar');\nfunction blah(){}";
    exampleEdits = [
      {
        loc: {
          line: 2,
          start: 20,
          length: 5
        },
        newPath: '../foo/baz42'
      }, {
        loc: {
          line: 2,
          start: 44,
          length: 5
        },
        newPath: '../bar/baz42'
      }
    ];
    applyToFile('foo.js', exampleEdits, fs);
    expect(written).to.equal("\nvar foo = require('../foo/baz42'), bar = require('../bar/baz42');\nfunction blah(){}");
  });
});
