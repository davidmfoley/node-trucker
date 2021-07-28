import ProgressBar from 'progress'
import analyzer, { SourceFileAnalyzer } from './sourceFileAnalyzer'
import { SourceFile, TruckerJob, SourceFileWithRequires } from '../types'

type Analyze = (
  analyzer: SourceFileAnalyzer,
  fileInfos: SourceFile[]
) => SourceFileWithRequires[]

export default (
  job: TruckerJob,
  fileInfos: SourceFile[]
): SourceFileWithRequires[] => {
  const showProgress = fileInfos.length > 100 && !job.quiet
  const analyze: Analyze = showProgress ? withBar : noBar
  return analyze(analyzer, fileInfos)
}

function noBar(analyzer: SourceFileAnalyzer, fileInfos: SourceFile[]) {
  return fileInfos.map(analyzer)
}

function withBar(analyzer: SourceFileAnalyzer, fileInfos: SourceFile[]) {
  console.error('analyzing ' + fileInfos.length + ' files for dependencies')
  var bar = new ProgressBar(
    '  [:bar] :current/:total :percent :elapseds elapsed, :etas to go',
    {
      incomplete: ' ',
      width: 20,
      total: fileInfos.length,
    }
  )

  var files = fileInfos.map(analyzeAndTick)
  bar.terminate()
  console.error('completed analysis')
  console.error('')
  return files

  function analyzeAndTick(fileInfo: SourceFile): SourceFileWithRequires {
    bar.tick()
    return analyzer(fileInfo)
  }
}
