var path = require('path');
var fs = require('fs');
var requireFinder = require('./requireFinder');

module.exports = function(fileInfo) {
  var contents = fs.readFileSync(fileInfo.fullPath, {encoding: 'utf-8'});
  var requires = requireFinder(fileInfo.filetype, contents);

  return {
    requires: requires.map(decorate)
  };

  function decorate(require) {
    return decorateRequire(fileInfo, require);
  }
};

function decorateRequire(fileInfo, req) {
  var fullPath = path.normalize(path.join(path.dirname(fileInfo.fullPath), req.path));
  return {
    loc: req.loc,
    path: req.path,
    fullPath: fullPath,
    resolvedFile: require.resolve(fullPath)
  };
}
