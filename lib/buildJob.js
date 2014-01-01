var path = require('path');
module.exports = function(options) {
  var scopePresent =  (options.scope && options.scope.length);
  var multiFrom = options._.length > 2;
  var _ = options._;

  return {
    base: scopePresent ?  path.normalize(options.scope) : process.cwd(),
    from: multiFrom? _.slice(0, _.length -1).map(blowOutPath) : blowOutPath(_[0]),
    to: blowOutPath(_[_.length - 1]),
    dryRun: !!options['dry-run'],
    quiet: !!options.quiet
  };
};

function blowOutPath(subPath) {
  return path.normalize(path.join(process.cwd(), subPath));
}
