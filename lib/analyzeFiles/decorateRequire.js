let path = require('path');

module.exports = function(fs = require('fs'), resolve = function(path, opts) { return require.resolve(path, opts);}) {

  return function decorateRequire(fileInfo, req) {
    var fullPath = path.normalize(path.join(path.dirname(fileInfo.fullPath), req.path));
    let resolved;
    try {
      resolved = resolve(req.path, { paths: [path.dirname(fileInfo.fullPath)] });

      if (resolved) {
        return {
          loc: req.loc,
          path: req.path,
          fullPath: fullPath,
          filePath: resolved
        };
      }
    }
    catch (e) {
      // nothing
    }

    const exts = [
      '.js',
      '.jsx',
      '.mjs',
      '.ts',
      '.tsx',
      '.coffee',
    ];

    if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
      return buildResult(fullPath);
    }

    exts.forEach(function (ext) {
      if (fs.existsSync(fullPath + ext)) {
        return buildResult(fullPath + ext);
      }
    });

    exts.forEach(function (ext) {
      if (fs.existsSync(fullPath + '/index' + ext)) {
        return buildResult(fullPath + '/index' + ext);
      }
    });

    function buildResult(filePath) {
      return {
        loc: req.loc,
        path: req.path,
        fullPath: fullPath,
        filePath: filePath
      };
    }
  };
};
