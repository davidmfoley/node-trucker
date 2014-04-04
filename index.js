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

function showInfo(job) {
  var matchingRequires = require('./lib/matchingRequires');

  var requires = matchingRequires(job);
  printRequires(requires, job);
}

var path = require('path');
function printRequires(files, job) {
  var outbound = {}, inbound = {};
  function digest(graph, from, to) {
    graph[from] = graph[from] || [];
    graph[from].push(to);
  }
  files.forEach(function(f) {
    f.requires.forEach(function(r) {
      digest(outbound, f.fullPath, r.filePath)
      digest(inbound, r.filePath, f.fullPath)
    });
  });

  if (job.files.length) {
    files = files.filter(function(f) {
      return job.files.filter(function(path) {
        return f.fullPath.indexOf(path) === 0;
      }).length;
    });
  }

  files.forEach(function(f) {
    var path = f.fullPath

    print(path, '');
    (outbound[path] || []).forEach(function(to){
      print(to, ' ---> ');
    });
    (inbound[path] || []).forEach(function(from){
      print(from, ' <--- ');
    });
  });

  function print(file, leader) {
    console.log(leader + path.relative(job.base, file));
  }
}

