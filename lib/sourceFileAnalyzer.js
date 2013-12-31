var path = require('path');
var fs = require('fs');
var requireFinder = require('./requireFinder');

module.exports = function(fileInfo) {
  var contents = fs.readFileSync(fileInfo.fullPath, {encoding: 'utf-8'});
  var requires = requireFinder(fileInfo.filetype, contents);

  return {
    fullPath: fileInfo.fullPath,
    filetype: fileInfo.filetype,
    requires: requires.map(decorate)
  };

  function decorate(require) {
    return decorateRequire(fileInfo, require);
  }
};

function decorateRequire(fileInfo, req) {
  var fullPath = path.normalize(path.join(path.dirname(fileInfo.fullPath), req.path));
  var filePath = fullPath;
  ['', '.js', '.coffee', '/index.js', '/index.coffee'].forEach(function(ext) {
    if (fs.existsSync(fullPath + ext)) {
      filePath = fullPath + ext;
    }
  });
  return {
    loc: req.loc,
    path: req.path,
    fullPath: fullPath,
    filePath: filePath
  };
}
