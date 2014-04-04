var path = require('path');

module.exports = function printDependencies(files, job) {
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

