var analyzeFiles = require('./analyzeFiles');
var fileFinder = require('./findFiles');
var ignoreFilter = require('./ignoreFilter');

module.exports = function matchingRequires(job) {
  var files = fileFinder(job.base);

  if (job.ignore && job.ignore.patterns && job.ignore.patterns.length) {
    files = ignoreFilter(job.ignore.base, job.ignore.patterns, files);
  }

  return analyzeFiles(job, files);
};
