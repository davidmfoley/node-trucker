import path from 'path'
import { SourceFileWithRequires } from './analyzeFiles'
import { TruckerJob } from './TruckerJob'

export default function printUnused(
  job: TruckerJob,
  files: SourceFileWithRequires[]
) {
  const byPath = {}

  files.forEach(function (f) {
    byPath[f.fullPath] = f
  })

  files.forEach(function (f) {
    f.requires.forEach(function (r) {
      delete byPath[r.filePath]
    })
  })

  Object.keys(byPath).forEach(function (f) {
    console.log(path.relative(job.base, f))
  })
}
