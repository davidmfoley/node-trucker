
module.exports = function(isDryRun) {
  handlerName =  isDryRun ? 'printChanges' : 'applyChanges';
  return require('./' + handlerName);
};


