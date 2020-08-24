var analyzeFiles = require('./analyzeFiles');
var fileFinder = require('./findFiles');
var filterExcludedFiles = require('./filterExcludedFiles');

module.exports = function matchingRequires(job) {
  var files = fileFinder(job.base);

  if (job.ignore && job.ignore.patterns && job.ignore.patterns.length) {
    files = filterExcludedFiles(job.ignore.base, job.ignore.patterns, files);
  }

  return analyzeFiles(job, files);
};
