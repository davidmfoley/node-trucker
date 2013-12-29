var util = require('util');
var coffee = require('coffee-script');
var requirePathFilter = require('./requirePathFilter');

module.exports = function(contents) {
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
    var variable = (node.value || {}).variable || {};
    if (variable.base && variable.base.value === 'require') {
      pushRequire(requires, node.value);
    } else if (node.variable && node.variable.base.value == 'require') {
      pushRequire(requires, node);
    }
  }
}

function pushRequire(requires, node) {
  var path = node.args[0].base.value;
  path = path.substring(1, path.length - 1);
  if (requirePathFilter(path)) {
    requires.push({
      path: path,
      loc: {
      }
    });
  }
}

function isRequire(node) {
  return true;
}
