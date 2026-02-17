import getLineEdits from './getLineEdits'
import editLine from './editLine'
import importedSourceFile from '../sourceFile'
import { ChangedRequire } from '../findChangedRequires'

function applyToFile(
  filePath: string,
  changedRequires: ChangedRequire[],
  sourceFile = importedSourceFile
) {
  const lines = sourceFile.readLines(filePath)
  const encoding = sourceFile.getEncoding(filePath)
  const updated = applyEdits(lines, changedRequires)
  sourceFile.writeLines(filePath, updated, encoding)
}

function applyEdits(lines: string[], requires: ChangedRequire[]) {
  const byLine = getLineEdits(requires)

  return lines.map((line, lineNumber) => editLine(line, byLine[lineNumber]))
}

export default applyToFile
