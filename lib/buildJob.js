var path = require('path');
module.exports = function(options) {
  var scopePresent =  (options.scope && options.scope.length);
  return {
    base: scopePresent ?  path.normalize(options.scope) : process.cwd(),
    from: blowOutPath(options._[0]),
    to: blowOutPath(options._[1]),
    dryRun: !!options['dry-run'],
    quiet: !!options.quiet
  };
};

function blowOutPath(subPath) {
  return path.normalize(path.join(process.cwd(), subPath));
}
