import path from 'path'

export default function printDependencies(files, job) {
  if (job.format === 'dot') {
    printViz(files, job)
  } else if (job.format === 'default') {
    printStandard(files, job)
  } else {
    console.error('unknown output format:', job.format)
    console.error('supported formats are: default, dot')
  }

  function printViz(files, job) {
    const clusterFills = [
      '#FFEEDD',
      '#EEDDFF',
      '#DDFFEE',
      '#FFDDEE',
      '#DDEEFF',
      '#EEFFDD',
    ]
    let clusterId = 0
    console.log('digraph Files {')
    console.log('rankdir=LR;')

    console.log('node[shape="box" style="filled" fillcolor="#FFFF99"];')
    console.log('edge[color="#888888"];')
    const folderTree = { files: [], children: {} }
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

    function printClusters(tree, label, depth, override?: string) {
      console.log('subgraph cluster_' + clusterId++, '{')
      console.log('  label = "' + (override || label || '.') + '/"')
      console.log('  style="filled";')
      console.log('  pad="2";')
      console.log('  penwidth="0.5";')
      console.log(
        '  fillcolor="' + clusterFills[depth % clusterFills.length] + '"'
      )
      Object.keys(tree.files).forEach(function (file) {
        console.log('  "' + path.relative(job.base, file) + '";')
      })

      Object.keys(tree.children).map((name) => {
        printClusters(
          tree.children[name],
          label + (label ? path.sep : '') + name,
          depth + 1
        )
      })

      console.log('}')
    }

    files.forEach(function (file) {
      console.log(
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
        console.log(
          ' ',
          '"' + path.relative(job.base, file.fullPath) + '"',
          '->',
          '"' + path.relative(job.base, r.filePath) + '"',
          ';'
        )
      })
    })

    console.log('}')
  }

  function printStandard(files, job) {
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
      console.log(leader + path.relative(job.base, file))
    }
  }
}
