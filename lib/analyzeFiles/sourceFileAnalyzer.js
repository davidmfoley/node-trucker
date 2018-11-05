var path = require('path');
var sourceFile = require('../handleFileChanges/sourceFile');
var findRequires = require('./findRequires');
var fs = require('fs');

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
    requires: requires.map(decorate)
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

function decorateRequire(fileInfo, req) {
  var fullPath = path.normalize(path.join(path.dirname(fileInfo.fullPath), req.path));
  let resolved;
  try {
    resolved = require.resolve(req.path, { paths: [path.dirname(fileInfo.fullPath)] });
  }
  catch (e) {
    // nothing
  }

  if (resolved) {
    return {
      loc: req.loc,
      path: req.path,
      fullPath: fullPath,
      filePath: resolved
    };
  }



  var filePath = fullPath;
  const exts = [
    '.js',
    '.jsx',
    '.mjs',
    '.ts',
    '.tsx',
    '.coffee',
  ];

  exts.forEach(function (ext) {
    if (fs.existsSync(fullPath + '/index' + ext)) {
      filePath = fullPath + '/index' + ext;
    }
  });

  exts.forEach(function (ext) {
    if (fs.existsSync(fullPath + ext)) {
      filePath = fullPath + ext;
    }
  });

  if (fs.existsSync(fullPath)) {
    filePath = fullPath;
  }

  return {
    loc: req.loc,
    path: req.path,
    fullPath: fullPath,
    filePath: filePath
  };
}
