import sourceFile from '../sourceFile'
import findRequires from './findRequires'
import DecorateRequire from './decorateRequire'
import { RequireInfo, SourceFileWithRequires } from '../types'
import { SourceFile } from '../types'

const decorateRequire = DecorateRequire()

const sourceFileAnalyzer = (fileInfo: SourceFile): SourceFileWithRequires => {
  var contents = sourceFile.readContents(fileInfo.fullPath)

  let requires: RequireInfo[] = []

  try {
    requires = findRequires(fileInfo.filetype, contents, fileInfo.fullPath)
  } catch (err) {
    printAnalyzeError(fileInfo, err)
  }

  return {
    fullPath: fileInfo.fullPath,
    filetype: fileInfo.filetype,
    requires: requires.map(decorate).filter(function (r) {
      return !!r
    }),
  }

  function decorate(require: RequireInfo) {
    return decorateRequire(fileInfo, require)
  }
}

function printAnalyzeError(fileInfo: SourceFile, err: Error) {
  console.warn('')
  console.warn('error processing ' + fileInfo.fullPath)
  console.warn(err)
  var stack = err.stack || ''
  console.warn(stack.split('\n')[1])
}

export type SourceFileAnalyzer = typeof sourceFileAnalyzer

export default sourceFileAnalyzer
