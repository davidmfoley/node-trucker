import { describe, before, it } from 'mocha'
import { expect } from 'chai'
import path from 'path';
import sourceFileAnalyzer from '../src/analyzeFiles/sourceFileAnalyzer';

let examplePath = path.normalize(path.join(__dirname, '../examples'));

describe('sourceFileAnalyzer', function() {
  var requires, result;
  describe('analyzing a sourcefile', function() {
    before(function() {
      result = sourceFileAnalyzer({
        fullPath: path.join(examplePath, 'stark/eddard.js'),
        relativePath: 'stark/eddard.js',
        filetype: 'js'
      });
      requires = result.requires.sort(function(a, b) {
        return a.fullPath > b.fullPath;
      });
    });
    it('has requires', function() {
      expect(requires.length).to.equal(2);
    });
    it('decorates require in a different location with full path', function() {
      var expected;
      expected = path.normalize(path.join(examplePath, 'tully/catelyn'));
      expect(requires[1].fullPath).to.equal(expected);
    });
    it('decorates require in the same location with full path', function() {
      var expected;
      expected = path.normalize(path.join(examplePath, 'stark/robb'));
      expect(requires[0].fullPath).to.equal(expected);
    });
  });
});
