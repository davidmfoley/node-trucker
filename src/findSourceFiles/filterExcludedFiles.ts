import excludedPathFilter from './excludedPathFilter'
import { SourceFile } from '../analyzeFiles'

export default (job: {
    ignore?: {
      base?: string
      patterns?: string[]
    }
  }) =>
  (files: SourceFile[]) => {
    const filter = excludedPathFilter(job)
    return files.filter((fileInfo) => filter(fileInfo.fullPath))
  }
