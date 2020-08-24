import ProgressBar from 'progress'
import analyzer from './sourceFileAnalyzer'
import { SourceFile, TruckerJob } from '../types'
import { SourceFileWithRequires } from '../types'

type Analyze = (fileInfos: SourceFile[]) => SourceFileWithRequires[]

export default (
  job: TruckerJob,
  fileInfos: SourceFile[]
): SourceFileWithRequires[] => {
  var analyze: Analyze = fileInfos.length > 100 && !job.quiet ? withBar : noBar
  return analyze(fileInfos)
}

function noBar(fileInfos: SourceFile[]) {
  return fileInfos.map(analyzer)
}

function withBar(fileInfos: SourceFile[]) {
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
