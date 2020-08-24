import coffee from 'coffee-script';
import requirePathFilter from './requirePathFilter';

export default function(contents) {
  var requires = [];
  var ast = coffee.nodes(contents);
  traverse(ast, requires);
  return requires;
};

function traverse(node, requires) {
  if (node.expressions){
    node.expressions.forEach(function(n) {traverse(n, requires);});
  }

  else if (node && typeof node === 'object') {
    pushIfRequire(requires, node.value);
    pushIfRequire(requires, node);
  }
}

function pushIfRequire(requires, node) {
  if (!node) return;
  if (node.variable && node.variable.base && node.variable.base.value === 'require') {
    pushRequire(requires, node);
  }
}

function pushRequire(requires, node) {
  var pathNode = node.args[0].base;
  var path = pathNode.value;
  path = path.substring(1, path.length - 1);
  var locationData = pathNode.locationData;
  if (requirePathFilter(path)) {
    requires.push({
      path: path,
      loc: {
        line: locationData.first_line + 1,
        start: locationData.first_column + 2,
        length: path.length
      }
    });
  }
}
