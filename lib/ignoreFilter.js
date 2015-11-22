var Minimatch = require('minimatch').Minimatch;

module.exports = function ignoreFilter(ignorePatterns, files) {
  var matchers = (ignorePatterns || []).map(createMatcher);
  var nameFilter = shouldInclude.bind(null, matchers);
  return files.filter(nameFilter);
};

function createMatcher(pattern) {
  return new Minimatch(pattern, {matchBase: true});
}

function shouldInclude(matchers, file) {
  for (var i = 0; i < matchers.length; i++) {
    if (matchers[i].match(file)) return false;
  }
  return true;
}
