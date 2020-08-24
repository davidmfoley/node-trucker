import path from 'path'
import fileInfo from './fileInfo'
import { LocationCalculator } from './types'
import { ChangedRequire } from '../types'

type Location = any

interface RequireInfo {
  filePath: string
  fullPath: string
  loc: Location
  path: string
}

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

  f.requires.forEach(function (r: RequireInfo) {
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

      if (newPath !== r.path) {
        changedRequires.push({
          loc: r.loc,
          path: r.path,
          newPath: newPath,
          fullPath: r.fullPath,
        })
      }
    }
  })

  return changedRequires
}
