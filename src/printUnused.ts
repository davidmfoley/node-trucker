import path from 'path'

export default function printUnused(job, files) {
  var byPath = {}

  files.forEach(function (f) {
    byPath[f.fullPath] = f
  })

  files.forEach(function (f) {
    f.requires.forEach(function (r) {
      delete byPath[r.filePath]
    })
  })

  Object.keys(byPath).forEach(function (f) {
    console.log(path.relative(job.base, f))
  })
}
