import sourceFile from '../sourceFile'
import findRequires from './findImports'
import DecorateRequire from './decorateRequire'
import { TruckerJob } from '../TruckerJob'
import { ImportInfo, SourceFileWithImports, SourceFile } from './types'

const decorateRequire = DecorateRequire()

const sourceFileAnalyzer = (job: TruckerJob) => {
  const finder = findRequires(job)
  return (fileInfo: SourceFile): SourceFileWithImports => {
    const contents = sourceFile.readContents(fileInfo.fullPath)

    let requires: ImportInfo[] = []

    try {
      requires = finder(fileInfo.filetype, contents, fileInfo.fullPath)
    } catch (err) {
      printAnalyzeError(fileInfo, err)
    }

    const decorate = (require: ImportInfo) => {
      return decorateRequire(fileInfo, require)
    }

    return {
      fullPath: fileInfo.fullPath,
      filetype: fileInfo.filetype,
      relativePath: fileInfo.relativePath,
      requires: requires.map(decorate).filter((r) => !!r),
    }
  }
}

function printAnalyzeError(fileInfo: SourceFile, err: Error) {
  console.warn('')
  console.warn('error processing ' + fileInfo.fullPath)
  console.warn(err)
  const stack = err.stack || ''
  console.warn(stack.split('\n')[1])
}

export type SourceFileAnalyzer = ReturnType<typeof sourceFileAnalyzer>

export default sourceFileAnalyzer
