var path = require('path');
var changedRequiresByFile = require('./lib/changedRequiresByFile');
var handleFileChanges = require('./lib/handleFileChanges');

module.exports = function(options) {
  var base = process.cwd();
  if (options.scope && options.scope.length) base = path.normalize(options.scope);
  var from = path.normalize(path.join(process.cwd(), options._[0]));
  var to = path.normalize(path.join(process.cwd(), options._[1]));

  var handler = handleFileChanges(options['dry-run']);

  var changes = changedRequiresByFile(from, to, base);
  var job = {
    from: from,
    to: to,
    base: base
  };
  handler(job, changes);
};

