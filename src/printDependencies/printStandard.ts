import path from 'path'
import { SourceFileWithRequires } from '../analyzeFiles'
import { TruckerJob } from '../TruckerJob'

export const printStandard = (
  files: SourceFileWithRequires[],
  job: TruckerJob,
  write = console.log
) => {
  const outbound = {},
    inbound = {}

  function digest(graph, from, to) {
    graph[from] = graph[from] || []
    graph[from].push(to)
  }

  files.forEach(function (f) {
    f.requires.forEach(function (r) {
      digest(outbound, f.fullPath, r.filePath)
      digest(inbound, r.filePath, f.fullPath)
    })
  })

  if (job.files.length) {
    files = files.filter(function (f) {
      return job.files.filter(function (path) {
        return f.fullPath.indexOf(path) === 0
      }).length
    })
  }
  files.forEach(printFile)

  function printFile(f) {
    const path = f.fullPath

    print(path, '')
    ;(outbound[path] || []).forEach(function (to) {
      print(to, ' ---> ')
    })
    ;(inbound[path] || []).forEach(function (from) {
      print(from, ' <--- ')
    })
  }

  function print(file, leader) {
    write(leader + path.relative(job.base, file))
  }
}
