import path from 'path'
import nodeFs from 'fs'

import { SourceFile } from '../types'
import { RequireInfo, FileRequireInfo } from '../types'

const requireResolve = (path, opts) => require.resolve(path, opts)

export default (fs = nodeFs, resolve = requireResolve) => (
  fileInfo: SourceFile,
  req: RequireInfo
): FileRequireInfo => {
  var fullPath = path.normalize(
    path.join(path.dirname(fileInfo.fullPath), req.path)
  )
  let resolved
  try {
    resolved = resolve(req.path, { paths: [path.dirname(fileInfo.fullPath)] })

    if (resolved) {
      return {
        loc: req.loc,
        path: req.path,
        fullPath: fullPath,
        filePath: resolved,
      }
    }
  } catch (e) {
    // nothing
  }

  const exts = ['.js', '.jsx', '.mjs', '.ts', '.tsx', '.coffee']

  if (isValidFile(fullPath)) return buildResult(fullPath)

  for (let i = 0; i < exts.length; i++) {
    if (isValidFile(fullPath + exts[i])) return buildResult(fullPath + exts[i])
  }

  for (let i = 0; i < exts.length; i++) {
    if (isValidFile(fullPath + '/index' + exts[i])) {
      return buildResult(fullPath + '/index' + exts[i])
    }
  }

  function isValidFile(path) {
    return fs.existsSync(path) && fs.statSync(path).isFile()
  }

  function buildResult(filePath) {
    return {
      loc: req.loc,
      path: req.path,
      fullPath: fullPath,
      filePath: filePath,
    }
  }
}
