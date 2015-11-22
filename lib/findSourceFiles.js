var analyzeFiles = require('./analyzeFiles');
var fileFinder = require('./findFiles');
var ignoreFilter = require('./ignoreFilter');

module.exports = function matchingRequires(job) {
  var files = fileFinder(job.base);
  var filtered = ignoreFilter(job.ignores, files);

  return analyzeFiles(job, filtered);
};
