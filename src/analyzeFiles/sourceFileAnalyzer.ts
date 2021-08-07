import sourceFile from '../sourceFile'
import findRequires from './findRequires'
import DecorateRequire from './decorateRequire'
import { RequireInfo, SourceFileWithRequires, TruckerJob } from '../types'
import { SourceFile } from '../types'

const decorateRequire = DecorateRequire()

const sourceFileAnalyzer = (job: TruckerJob) => {
  const finder = findRequires(job)
  return (fileInfo: SourceFile): SourceFileWithRequires => {
    var contents = sourceFile.readContents(fileInfo.fullPath)

    let requires: RequireInfo[] = []

    try {
      requires = finder(fileInfo.filetype, contents, fileInfo.fullPath)
    } catch (err) {
      printAnalyzeError(fileInfo, err)
    }

    const decorate = (require: RequireInfo) => {
      return decorateRequire(fileInfo, require)
    }

    return {
      fullPath: fileInfo.fullPath,
      filetype: fileInfo.filetype,
      requires: requires.map(decorate).filter((r) => !!r),
    }
  }
}

function printAnalyzeError(fileInfo: SourceFile, err: Error) {
  console.warn('')
  console.warn('error processing ' + fileInfo.fullPath)
  console.warn(err)
  var stack = err.stack || ''
  console.warn(stack.split('\n')[1])
}

export type SourceFileAnalyzer = ReturnType<typeof sourceFileAnalyzer>

export default sourceFileAnalyzer
