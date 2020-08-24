import ProgressBar from 'progress';
import analyzer from './sourceFileAnalyzer';
import { SourceFile } from '../types';

export default function(job, fileInfos: SourceFile[]) {
  var analyze = fileInfos.length > 100 && !job.quiet ? withBar : noBar;
  return analyze(fileInfos);
};

function noBar(fileInfos) {
  return fileInfos.map(analyzer);
}

function withBar(fileInfos) {
  console.error('analyzing ' + fileInfos.length + ' files for dependencies');
  var bar = new ProgressBar('  [:bar] :current/:total :percent :elapseds elapsed, :etas to go', {
    incomplete: ' ',
    width: 20,
    total: fileInfos.length
  });

  var files = fileInfos.map(analyzeAndTick);
  bar.terminate();
  console.error('completed analysis');
  console.error('');
  return files;

  function analyzeAndTick(fileInfo) {
    bar.tick();
    return analyzer(fileInfo);
  }
}
