import fs from 'fs'
import path from 'path'

export default {
  isDirectory: function (f) {
    const stat = fs.existsSync(f) && fs.statSync(f)
    return stat && stat.isDirectory()
  },
  isFile: function (f) {
    const stat = fs.existsSync(f) && fs.statSync(f)
    if (stat) return stat.isFile()
    const extname = path.extname(f)
    return (
      ['.js', '.coffee', '.jsx', '.mjs', '.ts', '.tsx'].indexOf(extname) >= 0
    )
  },
}
