import { SourceFileWithRequires } from '../analyzeFiles'
import { TruckerJob } from '../TruckerJob'
import { printStandard } from './printStandard'
import { printViz } from './printViz'

const printerByFormat = {
  dot: printViz,
  default: printStandard,
}

export default function printDependencies(
  files: SourceFileWithRequires[],
  job: TruckerJob
) {
  const printer = printerByFormat[job.format]
  if (!printer) {
    console.error('unknown output format:', job.format)
    console.error('supported formats are: default, dot')
    return
  }

  printer(files, job)
}
