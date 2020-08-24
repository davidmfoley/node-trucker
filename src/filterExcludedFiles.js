var ignore = require('ignore');
var excludedPathFilter = require('./excludedPathFilter');

module.exports = function filterExcludedFiles(ignoreBase, ignorePatterns, files) {
  var filter = excludedPathFilter(ignoreBase, ignorePatterns);
  return files.filter(function(fileInfo) {
    return filter(fileInfo.fullPath);
  });
};
