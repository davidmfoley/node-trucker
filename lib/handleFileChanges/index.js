
module.exports = function(isDryRun) {
  if (isDryRun) console.log('DRY RUN - no changes will be made.');
  handlerName =  isDryRun ? 'printChanges' : 'applyChanges';
  return require('./' + handlerName);
};


