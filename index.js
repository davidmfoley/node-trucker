var path = require('path');
var changedRequiresByFile = require('./lib/findChangedRequires/changedRequiresByFile');
var handleFileChanges = require('./lib/handleFileChanges');
var buildJob = require('./lib/buildJob');

module.exports = function(options) {
  var job = buildJob(options);

  var changes = changedRequiresByFile(job);

  var handler = handleFileChanges(job.dryRun);
  handler(job, changes);
};
