var analyzeFiles = require('./analyzeFiles');
var fileFinder = require('./findFiles');

module.exports = function matchingRequires(job) {
  return analyzeFiles(job, fileFinder(job.base));
};
