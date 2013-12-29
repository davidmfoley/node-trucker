var esprima = require('esprima');
var requirePathFilter = require('./requirePathFilter');

module.exports = function(contents) {
  var ast = esprima.parse(contents, {loc: true});
  var requires = [];
  traverse(ast, requires);
  return requires;
};

function isRequire(node) {
  var c = node.callee;
  return c && node.type === 'CallExpression' && c.type === 'Identifier' && c.name === 'require' && requirePathFilter(node.arguments[0].value);
}

function traverse(node, requires) {
  if (Array.isArray(node)) {
    node.forEach(function(n) {traverse(n, requires);});
  }

  else if (node && typeof node === 'object') {
    if (isRequire(node)) {
      var path = node.arguments[0];
      var req = {
        path: path.value,
        loc: { 
          line: path.loc
        }
      };
      requires.push(req);
    }
    Object.keys(node).forEach(function (key) {
      traverse(node[key], requires);
    });
  }
}
