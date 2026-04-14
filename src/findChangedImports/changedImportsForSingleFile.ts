import path from 'path'
import fileInfo from './fileInfo'
import { LocationCalculator } from './types'
import { FileRequireInfo, RequireLocation } from '../analyzeFiles'
import { applyAliasMapping } from './applyAliasMapping'

interface SourceFile {
  fullPath: string
  requires: FileRequireInfo[]
}

export interface ChangedImport {
  filePath: string
  newPath: string
  loc: RequireLocation
  path: string
}

export default (
  f: SourceFile,
  getNewLocation: LocationCalculator
): ChangedImport[] => {
  const changedImports = []
  const newFileLocation = getNewLocation(f.fullPath)

  for (const r of f.requires) {
    const newRequireLocation = getNewLocation(r.filePath)

    if (newFileLocation.isMoved || newRequireLocation.isMoved) {
      const extname = path.extname(r.filePath)

      let newRelativePath = path.relative(
        path.dirname(newFileLocation.fullPath),
        newRequireLocation.requirePath + extname
      )
      if (newRelativePath[0] !== '.') newRelativePath = './' + newRelativePath

      const isFile = fileInfo.isFile(r.fullPath)
      if (!isFile) {
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
            ? applyAliasMapping(r.mapping, r.fullPath).path
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
