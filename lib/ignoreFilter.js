var Minimatch = require('minimatch').Minimatch;
var path = require('path');

module.exports = function ignoreFilter(ignoreBase, ignorePatterns, files) {
  var matchers = getMatchers(ignorePatterns || []);
  var nameFilter = shouldInclude.bind(null, ignoreBase, matchers);
  return files.filter(nameFilter);
};

function getMatchers(patterns) {
  var matchers = [];
  patterns.forEach(function(pattern) {
    matchers.push(createMatcher(pattern));
    matchers.push(createMatcher(pattern + '/**'));
  });
  return matchers;
}

function createMatcher(pattern) {
  return new Minimatch(pattern, {matchBase: true});
}

function shouldInclude(base, matchers, file) {
  var relativeToBase = path.relative(base, file.fullPath);

  // don't exclude files above ignore file
  if (relativeToBase.indexOf('..') === 0) return true;

  for (var i = 0; i < matchers.length; i++) {
    if (matchers[i].match(relativeToBase)) return false;
  }
  return true;
}
