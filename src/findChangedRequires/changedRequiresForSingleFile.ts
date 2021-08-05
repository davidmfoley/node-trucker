import path from 'path'
import fileInfo from './fileInfo'
import { LocationCalculator } from './types'
import { ChangedRequire, FileRequireInfo, RequireInfo } from '../types'

interface SourceFile {
  fullPath: string
  requires: RequireInfo[]
}

export default (
  f: SourceFile,
  getNewLocation: LocationCalculator
): ChangedRequire[] => {
  var changedRequires = []
  var newFileLocation = getNewLocation(f.fullPath)

  f.requires.forEach(function (r: FileRequireInfo) {
    var newRequireLocation = getNewLocation(r.filePath)

    if (newFileLocation.isMoved || newRequireLocation.isMoved) {
      var extname = path.extname(r.filePath)
      var newPath = path.relative(
        path.dirname(newFileLocation.fullPath),
        newRequireLocation.requirePath + extname
      )
      if (newPath[0] !== '.') newPath = './' + newPath

      var isFile = fileInfo.isFile(r.fullPath)
      if (!isFile) {
        newPath = newPath.replace(/\/index\.(js|jsx|coffee|ts|tsx|mjs)$/, '')
        newPath = newPath.replace(/\.(js|jsx|coffee|ts|tsx|mjs)$/, '')
      }

      newPath = newPath.replace(/\\/g, '/')

      if (newPath !== r.relativePath) {
        changedRequires.push({
          loc: r.loc,
          path: r.relativePath,
          newPath: newPath,
          fullPath: r.fullPath,
        })
      }
    }
  })

  return changedRequires
}
