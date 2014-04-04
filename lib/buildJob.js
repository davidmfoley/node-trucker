var path = require('path');

module.exports = function(options) {
  var scopePresent =  (options.scope && options.scope.length);
  var _ = options._;
  var from = _.slice(0, _.length -1).map(blowOutPath);
  var to = blowOutPath(_[_.length - 1]);

  return {
    base: scopePresent ? path.normalize(options.scope) : process.cwd(),
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
