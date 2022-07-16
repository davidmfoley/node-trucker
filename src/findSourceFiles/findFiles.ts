import fs from 'fs'
import path from 'path'

export default function (base) {
  const files = []
  traverse(base, '.' + path.sep, files)
  return files
}

function traverse(base, current, files) {
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

function weCareAboutDirectory(name) {
  const ignore = ['node_modules', 'bower_components']
  return ignore.indexOf(name) === -1
}
function weCareAboutFile(name) {
  return /\.(js|jsx|coffee|mjs|ts|tsx)$/.exec(name)
}

function getFiletype(name) {
  if (/coffee$/.exec(name)) return 'coffee'
  if (/ts(x?)$/.exec(name)) return 'ts'
  return 'js'
}
