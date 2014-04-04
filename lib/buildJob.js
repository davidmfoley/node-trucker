var path = require('path');

module.exports = function(options) {
  var scopePresent =  (options.scope && options.scope.length);
  var _ = options._ || [];
  var files = _.map(blowOutPath);
  var from = files.slice(0, files.length -1);
  var to = files.length && files[files.length - 1];

  return {
    base: scopePresent ? path.normalize(options.scope) : process.cwd(),
    files: files,
    from: from,
    to: to,
    dryRun: !!options['dry-run'],
    quiet: !!options.quiet,
    info: !!options.info
  };
};

function blowOutPath(subPath) {
  return path.normalize(path.join(process.cwd(), subPath));
}
