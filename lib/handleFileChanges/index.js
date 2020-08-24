var checkForErrors = require('./checkForErrors');
var printChanges = require('./printChanges');
var applyChanges = require('./applyChanges');

module.exports = function(isDryRun) {
  if (isDryRun) console.log('DRY RUN - no changes will be made.');

  var handler =  isDryRun ? printChanges : applyChanges;

  return function(job, changes) {
    var errors = checkForErrors(changes);
    if (errors.length) {
      console.error('Unable to continue! ' + errors.length + ' errors occurred:');
      console.error(errors.join("\n"));
      return;
    }
    handler(job, changes);
  };
};
