var sourceFile = require('../handleFileChanges/sourceFile');
var findRequires = require('./findRequires');
var decorateRequire = require('./decorateRequire')();

module.exports = function(fileInfo) {
  var contents = sourceFile.readContents(fileInfo.fullPath);

  var requires;
  try {
    requires = findRequires(fileInfo.filetype, contents, fileInfo.fullPath);
  }
  catch(err) {
    printAnalyzeError(fileInfo, err);
    requires = [];
  }

  return {
    fullPath: fileInfo.fullPath,
    filetype: fileInfo.filetype,
    requires: requires.map(decorate).filter(function(r) { return !!r; })
  };

  function decorate(require) {
    return decorateRequire(fileInfo, require);
  }
};

function printAnalyzeError(fileInfo, err) {
  console.warn('');
  console.warn('error processing ' + fileInfo.fullPath);
  console.warn(err);
  var stack = err.stack || '';
  console.warn(stack.split('\n')[1]);
}

