var path = require('path');
var fileInfo = require('../fileInfo');

module.exports = function(f, getNewLocation) {
  var changedRequires = [];
  var newFileLocation = getNewLocation(f.fullPath);

  f.requires.forEach(function(r) {
    var newRequireLocation = getNewLocation(r.filePath);

    if (newFileLocation.isMoved || newRequireLocation.isMoved) {
      var extname = path.extname(r.filePath);
      var newPath = path.relative(path.dirname(newFileLocation.fullPath), newRequireLocation.requirePath + extname);
      if (newPath[0] !== '.') newPath = './' + newPath;

      var isFile = fileInfo.isFile(r.fullPath);
      if (!isFile) {
        newPath = newPath.replace(/\/index\.(js|jsx|coffee|ts|tsx|mjs)$/, '');
        newPath = newPath.replace(/\.(js|jsx|coffee|ts|tsx|mjs)$/, '');
      }

      if (newPath !== r.path) {
        changedRequires.push({
          loc: r.loc,
          path: r.path,
          newPath: newPath,
          fullPath: r.fullPath,
        });
      }
    }
  });

  return changedRequires;
};
