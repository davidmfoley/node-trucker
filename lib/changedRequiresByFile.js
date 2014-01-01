var fileLocationCalculator = require('./fileLocationCalculator');
var fileFinder = require('./fileFinder');
var moveCalculator = require('./fileMoveCalculator');
var path = require('path');

function changedRequiresByFile(from, to, base, analyzer) {
  var locationCalculator = fileLocationCalculator(from, to);
  var analyzeFiles = analyzer || require('./analyzeFiles');

  var files = analyzeFiles(fileFinder(base));

  return moveCalculator(files, locationCalculator);
}

module.exports = changedRequiresByFile;
