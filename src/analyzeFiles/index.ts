import ProgressBar from 'progress'
import analyzer, { SourceFileAnalyzer } from './sourceFileAnalyzer'
import { TruckerJob } from '../TruckerJob'
import {
  SourceFile,
  SourceFileWithImports,
  ImportLocation,
  ImportInfo,
  FileImportInfo,
} from './types'

export type {
  SourceFile,
  SourceFileWithImports,
  ImportLocation,
  ImportInfo,
  FileImportInfo,
}

type Analyze = (
  analyzer: SourceFileAnalyzer,
  fileInfos: SourceFile[]
) => SourceFileWithImports[]

export default (
  job: TruckerJob,
  fileInfos: SourceFile[]
): SourceFileWithImports[] => {
  const showProgress = fileInfos.length > 100 && !job.quiet
  const analyze: Analyze = showProgress ? withBar : noBar
  return analyze(analyzer(job), fileInfos)
}

function noBar(analyzer: SourceFileAnalyzer, fileInfos: SourceFile[]) {
  return fileInfos.map(analyzer)
}

function withBar(analyzer: SourceFileAnalyzer, fileInfos: SourceFile[]) {
  console.error('analyzing ' + fileInfos.length + ' files for dependencies')
  const bar = new ProgressBar(
    '  [:bar] :current/:total :percent :elapseds elapsed, :etas to go',
    {
      incomplete: ' ',
      width: 20,
      total: fileInfos.length,
    }
  )

  const files = fileInfos.map(analyzeAndTick)
  bar.terminate()
  console.error('completed analysis')
  console.error('')
  return files

  function analyzeAndTick(fileInfo: SourceFile): SourceFileWithImports {
    bar.tick()
    return analyzer(fileInfo)
  }
}
