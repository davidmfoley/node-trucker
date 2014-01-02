var changedRequiresByFile = require('./lib/findChangedRequires');
var handleFileChanges = require('./lib/handleFileChanges');
var buildJob = require('./lib/buildJob');

module.exports = function(options) {
  try {
    var job = buildJob(options);

    var changes = changedRequiresByFile(job);

    var handler = handleFileChanges(job.dryRun);
    handler(job, changes);
    return 0;
  }
  catch (error) {
    console.error(error.message);
    return 1;
  }
};
