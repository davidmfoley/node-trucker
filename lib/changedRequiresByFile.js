var fileLocationCalculator = require('./fileLocationCalculator');
var fileFinder = require('./findFiles');
var moveCalculator = require('./fileMoveCalculator');
var analyzeFiles = require('./analyzeFiles');

function changedRequiresByFile(job, analyzer) {
  var locationCalculator = fileLocationCalculator(job.from, job.to);

  var files = analyzeFiles(fileFinder(job.base));

  return moveCalculator(files, locationCalculator);
}

module.exports = changedRequiresByFile;
