var path = require('path');
var ignore = require('ignore');

module.exports = function ignoreFilter(ignoreBase, ignorePatterns, files) {
  var filter = ignore({ twoGlobstars: true })
    .addPattern(ignorePatterns)
    .createFilter();

  return files.filter(function (file) {
    var relativeToBase = path.relative(ignoreBase, file.fullPath);

    // don't exclude files above ignore file
    if (relativeToBase.indexOf('..') === 0) return true;

    return filter(relativeToBase);
  });
};
