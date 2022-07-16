import path from 'path'
import nodeFs from 'fs'

import { SourceFile } from '../types'
import { RequireInfo, FileRequireInfo } from '../types'

const requireResolve = (path: string, opts: any) => require.resolve(path, opts)

export default (fs = nodeFs, resolve = requireResolve) =>
  (fileInfo: SourceFile, req: RequireInfo): FileRequireInfo => {
    const isValidFile = (path: string) => {
      return fs.existsSync(path) && fs.statSync(path).isFile()
    }

    const buildResult = (filePath: string): FileRequireInfo => ({
      ...req,
      fullPath: fullPath,
      filePath: filePath,
    })

    const fullPath = path.normalize(
      path.join(path.dirname(fileInfo.fullPath), req.relativePath)
    )

    try {
      const resolved = resolve(req.relativePath, {
        paths: [path.dirname(fileInfo.fullPath)],
      })

      if (resolved) {
        return buildResult(resolved)
      }
    } catch (e) {
      // nothing
    }

    const exts = ['.js', '.jsx', '.mjs', '.ts', '.tsx', '.coffee']

    if (isValidFile(fullPath)) return buildResult(fullPath)

    for (let i = 0; i < exts.length; i++) {
      if (isValidFile(fullPath + exts[i]))
        return buildResult(fullPath + exts[i])
    }

    for (let i = 0; i < exts.length; i++) {
      if (isValidFile(fullPath + '/index' + exts[i])) {
        return buildResult(fullPath + '/index' + exts[i])
      }
    }
  }
