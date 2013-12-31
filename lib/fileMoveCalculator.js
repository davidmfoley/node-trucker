var path = require('path');
var changedRequiresForSingleFile = require('./changedRequiresForSingleFile');

module.exports = function(fileInfos, getNewLocation) {
  var files = [];

  fileInfos.forEach(function(f) {
    var newFileLocation = getNewLocation(f.fullPath);
    var changedRequires = changedRequiresForSingleFile(f, getNewLocation);

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
