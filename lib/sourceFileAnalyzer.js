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

function decorateRequire(fileInfo, require) {
  return {
    loc: require.loc,
    path: require.path,
    fullPath: path.normalize(path.join(path.dirname(fileInfo.fullPath), require.path))
  };
}
