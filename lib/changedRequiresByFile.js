var fileLocationCalculator = require('./fileLocationCalculator');
var fileFinder = require('./fileFinder');
var analyzer = require('./sourceFileAnalyzer');
var moveCalculator = require('./fileMoveCalculator');
var path = require('path');

function changedRequiresByFile(from, to, base) {
  var locationCalculator = fileLocationCalculator(from, to);
  var files = fileFinder(base).map(analyzer);

  return moveCalculator(files, locationCalculator);
}

module.exports = changedRequiresByFile;
