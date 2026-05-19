import getLineEdits from './getLineEdits'
import editLine from './editLine'
import importedSourceFile from '../sourceFile'
import { ChangedImport } from '../findChangedImports'

function applyToFile(
  filePath: string,
  changedImports: ChangedImport[],
  sourceFile = importedSourceFile
) {
  const lines = sourceFile.readLines(filePath)
  const encoding = sourceFile.getEncoding(filePath)
  const updated = applyEdits(lines, changedImports)
  sourceFile.writeLines(filePath, updated, encoding)
}

function applyEdits(lines: string[], imports: ChangedImport[]) {
  const byLine = getLineEdits(imports)

  return lines.map((line, lineNumber) => editLine(line, byLine[lineNumber]))
}

export default applyToFile
