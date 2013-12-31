var path = require('path');
module.exports = function(fileInfos, getNewLocation) {
  var files = [];

  fileInfos.forEach(function(f) {
    var changedRequires = [];
    var newFileLocation = getNewLocation(f.fullPath);

    f.requires.forEach(function(r) {
      var newRequireLocation = getNewLocation(r.filePath);

      if (newFileLocation.isMoved || newRequireLocation.isMoved) {
        var newPath = path.relative(path.dirname(newFileLocation.fullPath), newRequireLocation.requirePath);
        if (newPath[0] != '.') newPath = './' + newPath;

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
    if (changedRequires.length) {
      files.push({
        from: f.fullPath,
        to: newFileLocation.fullPath,
        requires: changedRequires
      });
    }
  });

  return files;
};
