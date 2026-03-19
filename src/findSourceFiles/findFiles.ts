import fs from 'fs'
import path from 'path'
import { SourceFile } from '../analyzeFiles'

export default function (base: string) {
  const files = [] as SourceFile[]
  traverse(base, '.' + path.sep, files)
  return files
}

function traverse(base: string, current: string, files: SourceFile[]) {
  const childDirs = []
  const fullCurrentPath = path.join(base, current)

  fs.readdirSync(fullCurrentPath).forEach(function (f) {
    const file = path.join(fullCurrentPath, f)
    const stat = fs.statSync(file)
    if (stat.isDirectory()) {
      if (weCareAboutDirectory(f)) childDirs.push(f)
    } else if (weCareAboutFile(file)) {
      files.push({
        relativePath: path.join(current, f),
        fullPath: file,
        filetype: getFiletype(file),
      })
    }
  })

  childDirs.forEach(function (f) {
    traverse(base, path.join(current, path.sep + f), files)
  })
}

function weCareAboutDirectory(name: string) {
  const ignore = ['node_modules', 'bower_components']
  return ignore.indexOf(name) === -1
}
function weCareAboutFile(name: string) {
  return /\.(js|jsx|coffee|mjs|ts|tsx)$/.exec(name)
}

function getFiletype(name: string) {
  if (/coffee$/.exec(name)) return 'coffee'
  if (/ts(x?)$/.exec(name)) return 'ts'
  return 'js'
}
