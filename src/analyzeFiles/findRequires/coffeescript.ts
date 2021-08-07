import coffee from 'coffeescript'
import requirePathFilter from './requirePathFilter'
import { RequireInfo } from '../../types'
import { relativeImport } from '../requireInfo'

type CoffeeNode = any

export default (contents: string): RequireInfo[] => {
  var requires: RequireInfo[] = []
  var ast = coffee.nodes(contents)
  traverse(ast, requires)
  return requires
}

function traverse(node: CoffeeNode, requires: RequireInfo[]) {
  if (node.body && node.body.expressions) {
    node.body.expressions.forEach(function (n) {
      traverse(n, requires)
    })
  } else if (node && typeof node === 'object') {
    pushIfRequire(requires, node.value)
    pushIfRequire(requires, node)
  }
}

function pushIfRequire(requires: RequireInfo[], node: CoffeeNode) {
  if (!node) return
  if (node?.base?.variable?.base?.value === 'require') {
    pushRequire(requires, node)
  }
}

function pushRequire(requires: RequireInfo[], node: CoffeeNode) {
  var pathNode = node.base.args[0].base
  var path = pathNode.value
  path = path.substring(1, path.length - 1)
  var locationData = pathNode.locationData
  if (requirePathFilter(path)) {
    requires.push(
      relativeImport(path, {
        line: locationData.first_line + 1,
        start: locationData.first_column + 2,
        length: path.length,
      })
    )
  }
}
