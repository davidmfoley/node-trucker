import path from 'path'
import { SourceFileWithRequires } from '../analyzeFiles'
import { TruckerJob } from '../TruckerJob'

type FolderTree = {
  files: Record<string, string>
  children: Record<string, FolderTree>
}

export const printViz = (
  files: SourceFileWithRequires[],
  job: TruckerJob,
  write = console.log
) => {
  const clusterFills = [
    '#FFEEDD',
    '#EEDDFF',
    '#DDFFEE',
    '#FFDDEE',
    '#DDEEFF',
    '#EEFFDD',
  ]
  let clusterId = 0

  const printClusters = (
    tree: FolderTree,
    label: string,
    depth: number,
    override?: string
  ) => {
    write('subgraph cluster_' + clusterId++, '{')
    write('  label = "' + (override || label || '.') + '/"')
    write('  style="filled";')
    write('  pad="2";')
    write('  penwidth="0.5";')
    write('  fillcolor="' + clusterFills[depth % clusterFills.length] + '"')
    Object.keys(tree.files).forEach(function (file) {
      write('  "' + path.relative(job.base, file) + '";')
    })

    Object.keys(tree.children).map((name) => {
      printClusters(
        tree.children[name],
        label + (label ? path.sep : '') + name,
        depth + 1
      )
    })

    write('}')
  }
  write('digraph Files {')
  write('rankdir=LR;')

  write('node[shape="box" style="filled" fillcolor="#FFFF99"];')
  write('edge[color="#888888"];')

  const folderTree = { files: {}, children: {} }

  files.forEach(function (file) {
    const filePath = path.relative(job.base, file.fullPath)
    const folders = filePath.split(path.sep)
    folders.pop()
    let target = folderTree
    let folder = folders.shift()
    while (folder) {
      if (!target.children[folder]) {
        target.children[folder] = {
          files: [],
          children: {},
        }
      }
      target = target.children[folder]
      folder = folders.shift()
    }
    target.files[filePath] = path.basename(filePath)
  })

  printClusters(folderTree, '', 0, job.base)

  files.forEach(function (file) {
    write(
      ' "' +
        path.relative(job.base, file.fullPath) +
        '" [label="' +
        path.basename(file.fullPath) +
        '"];'
    )
  })

  files.forEach(function (file) {
    file.requires.forEach(function (r) {
      if (path.relative(job.base, r.filePath).startsWith('..')) return
      write(
        ' ',
        '"' + path.relative(job.base, file.fullPath) + '"',
        '->',
        '"' + path.relative(job.base, r.filePath) + '"',
        ';'
      )
    })
  })

  write('}')
}
