var ProgressBar = require('progress');
var analyzer = require('./sourceFileAnalyzer');

module.exports = function(job, fileInfos) {
  var analyze = fileInfos.length > 100 && !job.quiet ? withBar : noBar;
  return analyze(fileInfos);
};

function noBar(fileInfos) {
  return fileInfos.map(analyzer);
}

function withBar(fileInfos) {
  console.log('analyzing ' + fileInfos.length + ' files for dependencies');
  var bar = new ProgressBar('  [:bar] :current/:total :percent :elapseds elapsed, :etas to go', {
    incomplete: ' ',
    width: 20,
    total: fileInfos.length
  });

  var files = fileInfos.map(analyzeAndTick);
  bar.terminate();
  console.log('completed analysis');
  console.log('');
  return files;

  function analyzeAndTick(fileInfo) {
    bar.tick();
    return analyzer(fileInfo);
  }
}
