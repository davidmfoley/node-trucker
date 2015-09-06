var babel = require('babel-core');
var requirePathFilter = require('./requirePathFilter');

module.exports = function(contents, filename) {
  contents = handleShebang(contents);

  var result = babel.transform(contents, {stage:0, filename: filename});

  var ast = result.ast;

  var requires = [];
  scan(ast.tokens, requires);
  return requires;
};

function scan(tokens, requires, index) {
  for(var i = 0; i < tokens.length; i++) {
    var token = tokens[i];
    if (token.type.keyword === 'import' || (token.type.label === 'name' && token.value === 'require')) {
      while (tokens[i].type.label !== 'string' && i < tokens.length) { i++; }

      addIfMatch(requires, tokens[i]);
    }
  }
}

function addIfMatch(requires, pathToken) {
  if (!requirePathFilter(pathToken.value)) return;
  var loc = pathToken.loc;

  var req = {
    path: pathToken.value,
    loc: {
      line: loc.start.line,
      start: loc.start.column + 2,
      length: pathToken.value.length
    }
  };
  requires.push(req);
}


function handleShebang(contents) {
  if (contents[0] === '#' && contents[1] === '!')
    return "//" + contents;

  return contents;
}
