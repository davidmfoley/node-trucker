var esprima = require('esprima');
var requirePathFilter = require('./requirePathFilter');

module.exports = function(contents) {
  contents = handleShebang(contents);
  var ast = esprima.parse(contents, {loc: true});
  var requires = [];
  traverse(ast, requires);
  return requires;
};

function handleShebang(contents) {
  if (contents[0] === '#' && contents[1] === '!')
    return "//" + contents;

  return contents;
}

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
      var loc = path.loc;
      var req = {
        path: path.value,
        loc: {
          line: loc.start.line,
          start: loc.start.column + 2,
          length: path.value.length
        }
      };
      requires.push(req);
    }
    Object.keys(node).forEach(function (key) {
      traverse(node[key], requires);
    });
  }
}
