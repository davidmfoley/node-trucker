import excludedPathFilter from './excludedPathFilter'
import { SourceFile } from '../types'

export default (job: {
    ignore?: {
      base?: string
      patterns?: string[]
    }
  }) =>
  (files: SourceFile[]) => {
    var filter = excludedPathFilter(job)
    return files.filter((fileInfo) => filter(fileInfo.fullPath))
  }
