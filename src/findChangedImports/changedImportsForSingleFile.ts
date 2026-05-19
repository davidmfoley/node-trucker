import path from 'path'
import fileInfo from './fileInfo'
import { LocationCalculator } from './types'
import { FileImportInfo, ImportLocation } from '../analyzeFiles'
import { applyAliasMapping } from './applyAliasMapping'

interface SourceFile {
  fullPath: string
  requires: FileImportInfo[]
}

export interface ChangedImport {
  filePath: string
  newPath: string
  loc: ImportLocation
  path: string
}

export default (
  f: SourceFile,
  getNewLocation: LocationCalculator
): ChangedImport[] => {
  const changedImports = []
  const newFileLocation = getNewLocation(f.fullPath)

  for (const r of f.requires) {
    const newImportLocation = getNewLocation(r.filePath)

    if (newFileLocation.isMoved || newImportLocation.isMoved) {
      let newRelativePath = path.relative(
        path.dirname(newFileLocation.fullPath),
        newImportLocation.fullPath
      )
      if (newRelativePath[0] !== '.') newRelativePath = './' + newRelativePath

      const isExactPathFileImport = fileInfo.isFile(r.fullPath)

      if (!isExactPathFileImport) {
        newRelativePath = newRelativePath.replace(
          /\/index\.(js|jsx|ts|tsx|mjs)$/,
          ''
        )
        newRelativePath = newRelativePath.replace(/\.(js|jsx|ts|tsx|mjs)$/, '')
      }

      newRelativePath = newRelativePath.replace(/\\/g, '/')

      if (newRelativePath !== r.relativePath) {
        const newPath =
          r.kind === 'alias'
            ? applyAliasMapping(r.mapping, newImportLocation.requirePath).path
            : newRelativePath

        if (newPath !== r.text) {
          changedImports.push({
            loc: r.loc,
            path: r.relativePath,
            newPath: newPath,
            fullPath: r.fullPath,
          })
        }
      }
    }
  }

  return changedImports
}
