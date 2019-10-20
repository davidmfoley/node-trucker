var path = require('path');
var ignore = require('ignore');

module.exports = function excludedFileFilter(ignoreBase, ignorePatterns) {
  var filter = ignore({ twoGlobstars: true })
    .addPattern(ignorePatterns)
    .createFilter();

  return function(filepath) {
    var relativeToBase = path.relative(ignoreBase, filepath);

    // don't exclude files above ignore file
    if (relativeToBase.indexOf('..') === 0) return true;

    return filter(relativeToBase);
  };
};
