var buildJob = require('./lib/buildJob');

module.exports = function(options) {
  try {
    var job = buildJob(options);
    var action = job.info ? showInfo : moveFiles;
    action(job);
    return 0;
  }
  catch (error) {
    console.error(error.message);
    return 1;
  }
};

var changedRequiresByFile = require('./lib/findChangedRequires');
var handleFileChanges = require('./lib/handleFileChanges');

function moveFiles(job) {
  var changes = changedRequiresByFile(job);
  var handler = handleFileChanges(job.dryRun);
  handler(job, changes);
}

var findSourceFiles = require('./lib/findSourceFiles');
var printDependencies = require('./lib/printDependencies');
function showInfo(job) {
  var requires = findSourceFiles(job);
  printDependencies(requires, job);
}

