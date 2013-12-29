var fs = require('fs');
var requireFinder = require('./requireFinder');

module.exports = function(fileInfo) {
  var contents = fs.readFileSync(fileInfo.fullPath, {encoding: 'utf-8'});
  var requires = requireFinder(fileInfo.filetype, contents);
  return {
    requires: requires
  };
};

