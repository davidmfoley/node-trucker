var buildJob = require('./lib/buildJob');
var printUnused = require('./lib/printUnused');

module.exports = function(options) {
  try {
    var job = buildJob(options);
    var action = getAction(job);
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

function getAction(job) {
  if (job.unused) return showUnused;
  if (job.info) return showInfo;
  return moveFiles;
}

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

function showUnused(job) {
  var files = findSourceFiles(job);
  printUnused(job, files);
}
